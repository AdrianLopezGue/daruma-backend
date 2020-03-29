export class GroupView {
    idGroup: string;
    name: string;
    currencyCode: string;
    idOwner: string;

    constructor(idGroup: string, name: string, currencyCode: string, idOwner: string){
        this.idGroup = idGroup;
        this.name = name;
        this.currencyCode = currencyCode;
        this.idOwner = idOwner;
    }
}