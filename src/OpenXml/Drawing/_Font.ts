import { defineAttribute, type DefineAttributeUsedOptions, OXML } from '../../core'

const options: DefineAttributeUsedOptions = {
  isProperty: true,
}

export interface FontJSON {
  charset?: number
  panose?: string
  pitchFamily?: number
  typeface?: string
}

export class _Font extends OXML {
  @defineAttribute('charset', { ...options, type: 'SByteValue' }) declare charset?: number
  @defineAttribute('panose', { ...options, type: 'HexBinaryValue' }) declare panose?: string
  @defineAttribute('pitchFamily', { ...options, type: 'SByteValue' }) declare pitchFamily?: number
  @defineAttribute('typeface', { ...options, type: 'StringValue' }) declare typeface?: string
}
