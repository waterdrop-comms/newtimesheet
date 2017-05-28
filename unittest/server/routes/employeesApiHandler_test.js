var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var employeeAPIHandler = require('./../../../server/routes/employeesApiHandler');

describe('EmployeeAPIHandler', function() {
/*    beforeEach(function() {
        sinon.stub(tax, 'calculate', function(subtotal, state, done) {
            setTimeout(function() {
                done({
                    amount: 30
                });
            }, 0);
        });
    });

    afterEach(function() {
        tax.calculate.restore();
    });
*/

    it('getEmployees() should return ', function() {
        var cartSummary = new CartSummary([]);
        expect(cartSummary.getSubtotal()).to.equal(0);
    });


});
