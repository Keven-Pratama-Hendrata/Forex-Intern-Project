import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import MarketPrice from '../../src/models/MarketPriceModel.js';
import { mockMarketPriceDoc } from '../mock/market.mock.js';

describe('MarketPriceModel', () => {
    it('should require all fields', async () => {
        const doc = new MarketPrice({});

        let error;
        try {
            await doc.validate();
        } catch (err) {
            error = err;
        }

        expect(error).to.exist;
        expect(error.errors).to.have.property('date');
        expect(error.errors).to.have.property('rates.USD');
        expect(error.errors).to.have.property('rates.JPY');
        expect(error.errors).to.have.property('rates.AUD');
        expect(error.errors).to.have.property('rates.EUR');
        expect(error.errors).to.have.property('rates.IDR');
    });

    it('should validate a valid document', async () => {
        const doc = new MarketPrice({
            date: new Date(),
            rates: { USD: 1, JPY: 100, AUD: 1.5, EUR: 0.9, IDR: 15000 }
        });

        let error;
        try {
            await doc.validate();
        } catch (err) {
            error = err;
        }

        expect(error).to.not.exist;
    });

    it('should have required fields', () => {
        const schemaPaths = MarketPrice.schema.paths;

        expect(schemaPaths).to.have.property('date');
        expect(schemaPaths.date.options.required).to.be.true;
        expect(schemaPaths).to.have.property('rates.USD');
        expect(schemaPaths['rates.USD'].options.required).to.be.true;
        expect(schemaPaths).to.have.property('rates.JPY');
        expect(schemaPaths['rates.JPY'].options.required).to.be.true;
        expect(schemaPaths).to.have.property('rates.AUD');
        expect(schemaPaths['rates.AUD'].options.required).to.be.true;
        expect(schemaPaths).to.have.property('rates.EUR');
        expect(schemaPaths['rates.EUR'].options.required).to.be.true;
        expect(schemaPaths).to.have.property('rates.IDR');
        expect(schemaPaths['rates.IDR'].options.required).to.be.true;
    });

    it('should enforce unique date', () => {
        expect(MarketPrice.schema.paths.date.options.unique).to.be.true;
    });

    it('should apply getters when converting to JSON', () => {
        const doc = new MarketPrice(mockMarketPriceDoc);

        const json = doc.toJSON();

        expect(json.rates.USD).to.equal(mockMarketPriceDoc.rates.USD);
        expect(json.rates.JPY).to.equal(mockMarketPriceDoc.rates.JPY);
        expect(json.rates.AUD).to.equal(mockMarketPriceDoc.rates.AUD);
        expect(json.rates.EUR).to.equal(mockMarketPriceDoc.rates.EUR);
        expect(json.rates.IDR).to.equal(mockMarketPriceDoc.rates.IDR);
    });

    it('should reject missing required rates', async () => {
        const partialDoc = { ...mockMarketPriceDoc, rates: { ...mockMarketPriceDoc.rates } };
        delete partialDoc.rates.IDR;
        const doc = new MarketPrice(partialDoc);

        let error;
        try {
            await doc.validate();
        } catch (err) {
            error = err;
        }

        expect(error).to.exist;
        expect(error.errors).to.have.property('rates.IDR');
    });
}); 