class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {"$or":[
         { name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          }},
          {category: {
            $regex: this.queryStr.keyword,
            $options: "i",
          }},
        ],}
      : {};

    console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeField = ["keyword", "page", "limit"];

    removeField.forEach((key) => delete queryCopy[key]);

    console.log(queryCopy);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(productPerPage) {
    const currentPage = Number(this.queryStr.page) || 0;

    const skip = productPerPage * (currentPage - 1);

    this.query = this.query.limit(productPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeatures;
