export interface IAUCTION {
  _id:String,
  status : number,
  category :number,
  auction : {
      dateListed : Array<number>
      description : string,
      initialPrice : number,
      postage : number,
      weight : number
  },
  sold : {
      dateSold : number,
      auctionNo : string,
      price : number,
      buyer : {userName:String, name:String, postCode:String}
  },
  paid  : { paidBy : String, postage : number, transactionNo : String },
  fee   : { finalFee        : { cost  : number, promo : Boolean, set : Boolean, completed : Boolean },
            postageFee      : { cost  : number,                  set : Boolean, completed : Boolean },
            paypalFee       : { cost  : number,                  set : Boolean, completed : Boolean }},
  courier : {
      company:String,
      trackingNo:String,
      cost:number,
      delivered : number
  },
  archive : Boolean
}