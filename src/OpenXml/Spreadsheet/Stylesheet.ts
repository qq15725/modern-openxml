import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.spreadsheet.stylesheet
 */
@defineElement('x:styleSheet')
export class Stylesheet extends OOXML {
  override toXmlString(): string {
    return `<styleSheet
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
>
  <borders count="10">
    <border>
      <left/>
      <right/>
      <top/>
      <bottom/>
      <diagonal/>
    </border>
    <border>
      <left style="thin">
        <color auto="1"/>
      </left>
      <right style="thin">
        <color auto="1"/>
      </right>
      <top style="thin">
        <color auto="1"/>
      </top>
      <bottom style="thin">
        <color auto="1"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left style="thin">
        <color rgb="FF3F3F3F"/>
      </left>
      <right style="thin">
        <color rgb="FF3F3F3F"/>
      </right>
      <top style="thin">
        <color rgb="FF3F3F3F"/>
      </top>
      <bottom style="thin">
        <color rgb="FF3F3F3F"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left style="thin">
        <color rgb="FF7F7F7F"/>
      </left>
      <right style="thin">
        <color rgb="FF7F7F7F"/>
      </right>
      <top style="thin">
        <color rgb="FF7F7F7F"/>
      </top>
      <bottom style="thin">
        <color rgb="FF7F7F7F"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left/>
      <right/>
      <top/>
      <bottom style="medium">
        <color theme="4" tint="0.499984740745262"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left/>
      <right/>
      <top/>
      <bottom style="medium">
        <color theme="4"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left/>
      <right/>
      <top style="thin">
        <color theme="4"/>
      </top>
      <bottom style="double">
        <color theme="4"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left style="double">
        <color rgb="FF3F3F3F"/>
      </left>
      <right style="double">
        <color rgb="FF3F3F3F"/>
      </right>
      <top style="double">
        <color rgb="FF3F3F3F"/>
      </top>
      <bottom style="double">
        <color rgb="FF3F3F3F"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left/>
      <right/>
      <top/>
      <bottom style="double">
        <color rgb="FFFF8001"/>
      </bottom>
      <diagonal/>
    </border>
    <border>
      <left style="thin">
        <color rgb="FFB2B2B2"/>
      </left>
      <right style="thin">
        <color rgb="FFB2B2B2"/>
      </right>
      <top style="thin">
        <color rgb="FFB2B2B2"/>
      </top>
      <bottom style="thin">
        <color rgb="FFB2B2B2"/>
      </bottom>
      <diagonal/>
    </border>
  </borders>

  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"
        applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"
        applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"
        applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
  </cellXfs>

  <cellStyles count="1">
    <cellStyle name="常规" xfId="0" builtinId="0"/>
  </cellStyles>

  <tableStyles count="0"/>
</styleSheet>`
  }
}
