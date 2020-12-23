import { compositionType as compositionTypeValues } from '../../constants/jwtSecret'

export default ({ jwt, name, groupId1, groupId2, compositionType }) => {
  return jwt && name && groupId1 && groupId2 && compositionTypeValues.includes(compositionType)
}
