class APIFeatures{
    constructor(query,queryString){
        this.query = query; 
        this.queryString =queryString;
    }
    filter(){
         // 1A) filtering
        const queryObj = {...this.queryString}
        const execludedFields = ['page','limit','sort','fields']
        execludedFields.forEach(el=> delete queryObj[el]) 
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`)
         this.query.find(JSON.parse(queryStr))
         return this
    }
    sort(){
          // 2)SORTING
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    limiting(){
         // 3) field limiting: which fields will get back to the client 
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }else{
            this.query =this.query.select('-__v')
        }
        return this
    }
    paginating(){
         // 4) pagination
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 100; 
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures