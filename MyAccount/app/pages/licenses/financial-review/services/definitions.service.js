angular.module('portal.pages.licenses.financialReview')
    .service('FinancialReviewDefinitionService', function() {
        'use strict';

        this.d1 = 'Enter the total dollar amount of the principal of all of the loans made during the year. ' +
            'The principal is the dollar amount being borrowed. It is the amount of money that was given to the borrower. ' +
            'The principal does not include the cost of borrowing (e.g. fees, interest charges, costs, commissions) or ' +
            'fees for non-sufficient funds (fees charged when there is not enough money to pay the loan back) ' +
            'or default fees (late payment charges). ';

        this.d2 = 'Enter the cost of borrowing for all loans made during the year. The cost of borrowing is the combined ' +
            'dollar amount of all fees, interest charges, costs, commissions, etc. borrowers were charged for all loans ' +
            'during the year. The cost of borrowing does not include the principal of the loans or fees charged because of ' +
            'non-sufficient funds or loan defaults. Simply stated, it is the difference between the principal amount and, ' +
            'the amount paid back to the lender by the borrower.';

        this.d3 = 'Enter the total number of loans made during the year where the principal amount of the loan was between $0 and $500. The principal is the dollar amount of money borrowed. It is the amount of money that was given to the borrower.';
        this.d4 = 'Enter the total number of loans made during the year where the principal amount of the loan was between $501 and $1,000.';
        this.d5 = 'Enter the total number of loans made during the year where the principal amount of the loan was between $1,001 and $1,500.';
        this.d6 = 'Enter the total dollar amount of all loans (principal only) made during the year where the principal amount of the loan was between $0 and $500. The principal is the dollar amount of money borrowed It is the amount of money that was given to the borrower.';
        this.d7 = 'Enter the total dollar amount of all loans (principal only) made during the year where the principal amount of the loan was between $501 and $1,000.';
        this.d8 = 'Enter the total dollar amount of all loans (principal only) made during the year where the principal amount of the loan was between $1,001 and $1,500.';
        this.d9 = 'Enter the total number of all loans made during the year where the term of the loans (the time between the date of the first loan advancement and the contracted date of final repayment) was between 1 and 7 days. ';
        this.d10 = 'Enter the total number of all loans made during the year where the term of the loans (the time between the date of the first advancement and the contracted date of final repayment) was between 8 and 14 days.';
        this.d11 = 'Enter the total number of all loans made during the year where the term of the loans (the time between the date of the first advancement and the contracted date of final repayment) was between 15 and 21 days.';
        this.d12 = 'Enter the total number of all loans made during the year where the term of the loans (the time between the date of the first advancement and the contracted date of final repayment) was between 22 and 30 days.';
        this.d13 = 'Enter the total number of all loans made during the year where the term of the loans (the time between the date of the first advancement and the contracted date of final repayment) was between 31 and 62 days.';
        this.d14 = 'Enter the total dollar amount of all loans (principal only) made during the year where the term of the loans (the time between the date of advancement and the contracted date of final repayment) was between 1 and 7 days.';
        this.d15 = 'Enter the total dollar amount of all loans (principal only) made during the year where the term of the loans (the time between the date of advancement and the contracted date of final repayment) was between 8 and 14 days';
        this.d16 = 'Enter the total dollar amount of all loans (principal only) made during the year where the term of the loans (the time between the date of advancement and the contracted date of final repayment) was between 15 and 21 days.';
        this.d17 = 'Enter the total dollar amount of all loans (principal only) made during the year where the term of the loans (the time between the date of advancement and the contracted date of final repayment) was between 22 and 30 days.';
        this.d18 = 'Enter the total dollar amount of all loans (principal only) made during the year where the term of the loans (the time between the date of advancement and the contracted date of final repayment) was between 31 and 62 days.';
        this.d19 = 'Enter the total number of loan advances given to or on behalf of all borrowers for all the loans made during the year (whether given out by cash, cheque, EFT, debit card or prepaid credit card). The number of loan advancements depends on whether the money given to the borrower was as a single payment or multiple payments from you to the borrower.';
        this.d20 = 'Enter the total number of loan repayments received from borrowers for all the loans made during the year (whether received by cash, cheque, EFT, returned on a debit card or returned on a prepaid credit card).';
        this.d21 = 'Enter the total number of debit cards sold or arranged (either as an agent or proprietor) to initially disburse some or all of the loan amount, for all the loans made during the year. The debit cards sold to or arranged for a borrower, are at an additional cost not included in the cost of borrowing.';
        this.d22 = 'Enter the total number of prepaid “credit cards” sold or arranged (either as an agent or proprietor) to initially disburse some or all of the loan amount, for all the loans made during the year. The prepaid credit cards sold to or arranged for a borrower, are at an additional cost not included in the cost of borrowing. ';
        this.d23 = 'Enter the total number of bank accounts sold or arranged (either as an agent or proprietor) to initially disburse some or all of the loans, for all the loans made during the year. The bank accounts sold to or arranged for a borrower, are at an additional cost not included in the cost of borrowing. ';
        this.d24 = 'Enter the total number of loan protection insurance policies sold or arranged (either as an agent or proprietor) to ensure repayment of the loan to the lender if the borrower died and/or became disabled and/or became unemployed, for all the loans made during the year. The loan protection insurance policies sold to or arranged for a borrower at an additional cost not included in the cost of borrowing.';
        this.d25 = 'Enter the total dollar amount collected for the year, from selling or arranging (either as an agent or proprietor) debit cards for the initial transfer of loans.';
        this.d26 = 'Enter the total dollar amount collected for the year, from selling or arranging (either as an agent or proprietor) prepaid credit cards for the initial transfer of loans.';
        this.d27 = 'Enter the total dollar amount collected for the year, from selling or arranging (either as an agent or proprietor) bank accounts for the initial transfer of loans.';
        this.d28 = 'Enter the total dollar amount collected for the year, from selling or arranging (either as an agent or proprietor) insurance policies to ensure the repayment of a loan to the lender.';
        this.d29 = 'Enter the total number of all defaulted loans made during the year. Defaulted loans are any loan where the loan agreement is not met (e.g. late repayment or non-sufficient funds), regardless of whether or not the borrower eventually repaid the loan.';
        this.d30 = 'Enter the total amount (principal only) of defaulted loans made during the year. Defaulted loans are any loan where the loan agreement is not met (e.g. late repayment or non-sufficient funds), regardless of whether or not the borrower eventually repaid the loan.';
        this.d31 = 'Enter the total number of uncollectable loans made during the year. Uncollectable loans are never repaid and are accordingly written off or are very likely never to be repaid. ';
        this.d32 = 'Enter the total dollar amount of loans (principal only) made during the year that are uncollectable loans. Uncollectable loans are never repaid and are accordingly written off or are very likely never to be repaid.';
        this.d33 = 'Enter the total dollar amount of any fees charged because of non-sufficient funds for dishonoured cheques and pre-authorized debits (PAD’s) that occurred during the year.';
        this.d34 = 'Enter the total dollar amount of any interest charged on the remaining principal of defaulted loans or late loan repayments made during the year.';
        this.d35 = 'Enter the total number of individual borrowers that you made only 1 payday loan to during the year.';
        this.d36 = 'Enter the total number of individual borrowers that you made 2 to 5 payday loans to during the year.';
        this.d37 = 'Enter the total number of individual borrowers that you made 6 to 10 payday loans to during the year.';
        this.d38 = 'Enter the total number of individual borrowers that you made 11 to 15 payday loans to during the year.';
        this.d39 = 'Enter the total number of individual borrowers that you made more than 16 payday loans to during the year.';

    });