module.exports = {
  Filter: {
    unique(value, index, self) { 
      return self.indexOf(value) === index;
    }
  }
}