export class OrderModel {
    public _id: string
    public userId: string
    public cartId: string
    public totalPrice: number;
    public cityToDeliver: string;
    public streetToDeliver: string;
    public dateToDeliver: string
    public creationDate: string
    public lastCreditDigits: string;
}
