describe('parse opts', () => {
  it('Bind defaults to this when no opts are passed')
  it('Override defaults with passed opts')
  it('Throw if opts is not an object')

  //----------------------------------------------------------
  // Typecheck opts -- numbers
  //----------------------------------------------------------
  it('Throw if delay option is not a number')
  it('Throw if indent option is not a number')

  //----------------------------------------------------------
  // Typecheck opts -- strings
  //----------------------------------------------------------
  it('Throw if errorColor option is not a string')
  it('Throw if errorIndicator option is not a string')
  it('Throw if incompleteColor option is not a string')
  it('Throw if successColor option is not a string')
  it('Throw if succesIndicator option is not a string')

  //----------------------------------------------------------
  // Typecheck opts -- array of strings
  //----------------------------------------------------------
  it('Throw if frames option is not an array of strings')
})
