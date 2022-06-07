##Student Details
`
{
    _id: mongoose.Schema.Types.ObjectId,
    name: String ,
    gender: String,
    rollNo:Number,
    contact: Number,
    email:String,
    address: String,
    classNo: Number
}

GET all student list:
/student
GET selected stident 
/student/studentId  eg: /student/629e56927e5ae9ec5306fa67
POST new student details
/student

`