export class OOXMLValue {
  static DPI = 72

  static stringify(value: any, type: string): string {
    switch (type) {
      case 'boolean':
        return value ? '1' : '0'
      case 'degree':
        return String(Number(value) * 60000)
      case 'fontSize':
        return String(Number(value) * 100)
      case 'number':
        return String(value)
      case 'string':
        return String(value)
      case 'emu':
        return String((Number(value) / this.DPI) * 914400)
      case 'dxa':
        return String((Number(value) / this.DPI) * 1440)
      case 'percentage':
        return String(Number(value) * 1000)
      case 'rate':
        return String(Number(value) * 100000)
      case 'lineHeight':
        return String((value * 100000) / 1.2018 - 0.0034)
      default:
        throw new Error(`type not found: ${type}`)
    }
  }

  static parse(value: any, type: string): any {
    switch (type) {
      case 'boolean':
        return Number(value) === 1
      case 'degree':
      case 'ST_Angle':
      case 'ST_PositiveFixedAngle':
        return Number(value) / 60000
      case 'fontSize':
        return Number(value) / 100
      case 'number':
      case 'SByteValue':
        return Number(value)
      case 'string':
      case 'HexBinaryValue':
      case 'StringValue':
        return String(value)
      case 'emu':
      case 'ST_PositiveCoordinate':
      case 'ST_Coordinate32':
      case 'ST_AdjCoordinate':
        return (Number(value) / 914400) * this.DPI
      case 'dxa':
        return (Number(value) / 1440) * this.DPI
      case 'percentage':
      case 'ST_Percentage':
      case 'CT_PositiveFixedPercentage':
      case 'rate':
        return Number(value) / 100000
      case 'ST_TextSpacingPercentOrPercentString':
        return Number(String(value).replace('%', '')) / 100000
      case 'ST_TextSpacingPoint':
        return Number(value) / 100
      case 'lineHeight':
        return (Number(value) / 100000) * 1.2018 + 0.0034
    }
    throw new Error(`type not found: ${type}`)
  }
}
