export type OOXMLValueType
  = | 'boolean'
    | 'degree'
    | 'ST_Angle'
    | 'ST_PositiveFixedAngle'
    | 'positiveFixedAngle'
    | 'fontSize'
    | 'int'
    | 'unsignedInt'
    | 'number'
    | 'SByteValue'
    | 'ST_TLTimeNodeID'
    | 'ST_ShapeID'
    | 'string'
    | 'HexBinaryValue'
    | 'StringValue'
    | 'ST_LineEndLength'
    | 'ST_LineEndWidth'
    | 'emu'
    | 'ST_PositiveCoordinate'
    | 'ST_LineWidth'
    | 'ST_Coordinate32'
    | 'ST_AdjCoordinate'
    | 'dxa'
    | 'percentage'
    | 'ST_Percentage'
    | 'ST_PositivePercentage'
    | 'CT_PositiveFixedPercentage'
    | 'ST_PositiveFixedPercentage'
    | 'positiveFixedPercentage'
    | 'rate'
    | 'ST_TextSpacingPercentOrPercentString'
    | 'ST_TextSpacingPoint'
    | 'lineHeight'

export class OOXMLValue {
  static DPI = 72

  static encode(value: any, type: OOXMLValueType): string {
    value ??= 0
    switch (type) {
      case 'boolean':
        return value ? '1' : '0'
      case 'degree':
      case 'ST_Angle':
      case 'ST_PositiveFixedAngle':
      case 'positiveFixedAngle':
        return String(~~(Number(value) * 60000))
      case 'fontSize':
        return String(~~(Number(value) * 100))
      case 'int':
      case 'unsignedInt':
      case 'number':
      case 'SByteValue':
      case 'ST_TLTimeNodeID':
      case 'ST_ShapeID':
        return String(~~value)
      case 'string':
      case 'HexBinaryValue':
      case 'StringValue':
      case 'ST_LineEndLength':
      case 'ST_LineEndWidth':
        return String(~~value)
      case 'emu':
      case 'ST_PositiveCoordinate':
      case 'ST_LineWidth':
      case 'ST_Coordinate32':
      case 'ST_AdjCoordinate':
        return String(~~((Number(value) / this.DPI) * 914400))
      case 'dxa':
        return String(~~((Number(value) / this.DPI) * 1440))
      case 'percentage':
      case 'ST_Percentage':
      case 'ST_PositivePercentage':
      case 'CT_PositiveFixedPercentage':
      case 'ST_PositiveFixedPercentage':
      case 'positiveFixedPercentage':
      case 'ST_TextSpacingPercentOrPercentString':
      case 'rate':
        return String(~~(Number(value) * 100000))
      case 'ST_TextSpacingPoint':
        return String(~~(value * 100))
      case 'lineHeight':
        return String(~~((value * 100000) / 1.2018 - 0.0034))
      default:
        throw new Error(`type not found: ${type}`)
    }
  }

  static decode(value: any, type: OOXMLValueType): any {
    if (value === undefined) {
      return undefined
    }
    switch (type) {
      case 'boolean':
        return value === 'true' || Number(value) === 1
      case 'degree':
      case 'ST_Angle':
      case 'ST_PositiveFixedAngle':
      case 'positiveFixedAngle':
        return Number(value) / 60000
      case 'fontSize':
        return Number(value) / 100
      case 'int':
      case 'unsignedInt':
      case 'number':
      case 'SByteValue':
      case 'ST_TLTimeNodeID':
      case 'ST_ShapeID':
        return Number(value)
      case 'string':
      case 'HexBinaryValue':
      case 'StringValue':
      case 'ST_LineEndLength':
      case 'ST_LineEndWidth':
        return String(value)
      case 'emu':
      case 'ST_PositiveCoordinate':
      case 'ST_LineWidth':
      case 'ST_Coordinate32':
      case 'ST_AdjCoordinate':
        return (Number(value) / 914400) * this.DPI
      case 'dxa':
        return (Number(value) / 1440) * this.DPI
      case 'percentage':
      case 'ST_Percentage':
      case 'ST_PositivePercentage':
      case 'CT_PositiveFixedPercentage':
      case 'ST_PositiveFixedPercentage':
      case 'positiveFixedPercentage':
      case 'ST_TextSpacingPercentOrPercentString':
      case 'rate':
        return Number(value) / 100000
      case 'ST_TextSpacingPoint':
        return Number(value) / 100
      case 'lineHeight':
        return (Number(value) / 100000) * 1.2018 + 0.0034
    }
    throw new Error(`type not found: ${type}`)
  }
}
