import { compositionType as compositionTypeValues } from '../../constants/jwtSecret'

export default ({ jwt, name, groupIdLeft, groupIdRight, compositionType }) => {
  return jwt && name && groupIdLeft && groupIdRight && compositionTypeValues.includes(compositionType)
}
