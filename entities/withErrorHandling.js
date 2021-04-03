import colors from 'colors/safe'
import stringify from 'json-stringify-pretty-compact'

const withErrorHandling = srpcs => {
  const handleError = async (params, srpc, srpcName) => {
    try {
      const result = await srpc(params)

      return result
    } catch (err) {
      const [, firstLine] = err.stack.split('\n')

      console.log(
        colors.red.underline('Error:'),
        colors.bgRed.white(err.message),
        '\n\n'
      )
      console.log(
        colors.red.underline('Details:'),
        colors.white('occurred in'),
        colors.bgRed.white(srpcName),
        colors.white(`at line ${firstLine.split(':')[1]}`),
        '\n\n'
      )
      console.log(
        colors.red.underline('Params:'),
        colors.yellow(stringify(params))
      )

      return { success: false }
    }
  }

  const result = Object.fromEntries(
    Object.entries(srpcs)
      .map(([srpcName, srpc]) => [srpcName, params => handleError(params, srpc, srpcName)])
  )

  return result
}

export default withErrorHandling
