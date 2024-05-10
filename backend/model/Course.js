const mongoose=require('mongoose')

const schema=mongoose.Schema;

const useschema= new schema({
        code:{
            type:  String,
            required:true
        },
        cname:{
            type: String,
            required:true
        },
        desc:{
            type: String,
            required:true
        },
        check:{
            type: Boolean,
            required:true
        },
})

module.exports=mongoose.model('Course',useschema)
