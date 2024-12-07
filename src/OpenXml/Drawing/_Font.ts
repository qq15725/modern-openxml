import { defineAttribute, OXML } from '../../core'

export class _Font extends OXML {
  @defineAttribute('charset', 'SByteValue') declare charset?: number
  @defineAttribute('panose', 'HexBinaryValue') declare panose?: string
  @defineAttribute('pitchFamily', 'SByteValue') declare pitchFamily?: number
  @defineAttribute('typeface', 'StringValue') declare typeface?: string
}
