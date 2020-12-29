const mongoose = require('mongoose');

const donutSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  description : {
    type: String,

  },
  coverImage : {
    type: Buffer,
    required: true
  },

  coverImageType: {
    type: String,
    required: true
  }
});

donutSchema.virtual('coverImagePath').get(function() {
  // if(this.coverImage != null && this.coverImageType != null) {return 'data:${this.coverImageType}; charset=utf-8; base64, ${this.coverImage.toString('base64')}'}
  if (this.coverImage != null && this.coverImageType != null) {
         return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
     }

})


module.exports = mongoose.model('Donut', donutSchema);
