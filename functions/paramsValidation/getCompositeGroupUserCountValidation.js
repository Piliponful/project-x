import { compositionType as compositionTypeValues } from '../../constants/jwtSecret'

export default ({ jwt, groupIdLeft, groupIdRight, compositionType }) => {
  return jwt && groupIdLeft && groupIdRight && compositionTypeValues.includes(compositionType)
}
