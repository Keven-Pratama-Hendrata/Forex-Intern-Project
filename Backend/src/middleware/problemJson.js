function toProblemJson({
    type = '/problems/internal-server-error',
    title = 'Internal Server Error',
    status = 500,
    detail = 'An unexpected error occurred.',
    instance = undefined,
    additional = {}
}) {
    const problem = {
        type,
        title,
        status,
        detail,
        ...additional
    };
    if (instance) problem.instance = instance;
    return problem;
}

function problemJsonErrorHandler(err, req, res, next) {
    const accept = req.headers.accept || '';
    const wantsProblem = accept.includes('application/problem+json');

    let status = err.status || err.statusCode || 500;
    let type = '/problems/internal-server-error';
    let title = 'Internal Server Error';
    let detail = err.message || 'An unexpected error occurred.';

    if (status === 400) {
        type = '/problems/bad-request';
        title = 'Bad Request';
    } else if (status === 401) {
        type = '/problems/unauthorized';
        title = 'Unauthorized';
    } else if (status === 403) {
        type = '/problems/forbidden';
        title = 'Forbidden';
    } else if (status === 404) {
        type = '/problems/not-found';
        title = 'Not Found';
    } else if (status === 429) {
        type = '/problems/too-many-requests';
        title = 'Too Many Requests';
    }

    if (wantsProblem) {
        res.status(status).type('application/problem+json').json(
            toProblemJson({ type, title, status, detail })
        );
    } else {
        res.status(status).json({ message: detail });
    }
}

module.exports = problemJsonErrorHandler; 