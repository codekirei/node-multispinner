describe('parse opts', () => {
  it('Bind defaults to this when no opts are passed')
  it('Override defaults with passed opts')
  it('Handle partially-configured colors opt')
  it('Throw when opts is not an object')

  //----------------------------------------------------------
  // Typcheck opts -- booleans
  //----------------------------------------------------------
  it('Throw when clear option is not a bool')

  //----------------------------------------------------------
  // Typecheck opts -- numbers
  //----------------------------------------------------------
  it('Throw when interval option is not a number')
  it('Throw when indent option is not a number')

  //----------------------------------------------------------
  // Typecheck opts -- strings
  //----------------------------------------------------------
  it('Throw when errorSymbol option is not a string')
  it('Throw when succesSymbol option is not a string')
  it('Throw when preText option is not a string')
  it('Throw when postText option is not a string')

  //----------------------------------------------------------
  // Typecheck opts -- colors
  //----------------------------------------------------------
  it('Throw when colors option is not an object')
  it('Throw when color is assigned to nonexistant state')

  //----------------------------------------------------------
  // Typecheck opts -- frames
  //----------------------------------------------------------
  it('Throw when frames option is not an array of strings')
})
