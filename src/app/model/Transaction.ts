export interface Transaction {
    id?: number;
    accountNumber: number;
    type?: string;
    amount: number;
    transactionDate: string;
    description?: string;
    accountBalance?: number;
    customerId?: number;
    customerName?: string;
}

export interface TransactionDto {
    id?: number;
    accountNumber: number;
    type?: string;
    amount: number;
    transactionDate: string;
    description?: string;
    accountBalance?: number;
    customerId?: number;
    customerName?: string;
}