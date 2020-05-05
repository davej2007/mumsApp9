export interface IVISIT {
    _id         :   String,
    date        :   number,
    by          :   String,
    checks      : { water:Boolean, windows:Boolean, doors:Boolean},
    comments    :   String
  }