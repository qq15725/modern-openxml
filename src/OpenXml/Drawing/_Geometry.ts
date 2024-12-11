import type { AdjustValueList } from './AdjustValueList'
import type { PathList } from './PathList'
import type { ShapeGuideList } from './ShapeGuideList'
import { defineChild, OOXML, OOXMLValue } from '../../core'

export function parseGeometryVariables(
  width: number,
  height: number,
  vars: [string, string][],
): [string, string][] {
  width = OOXMLValue.parse(width, 'emu')
  height = OOXMLValue.parse(height, 'emu')

  const max = Math.max(width, height)
  const min = Math.min(width, height)

  const variables: Record<string, number> = {
    'l': 0,
    'r': width,
    'w': width,
    'wd2': width / 2,
    'wd4': width / 4,
    'wd5': width / 5,
    'wd6': width / 6,
    'wd8': width / 8,
    'wd10': width / 10,
    'hc': width / 2,
    't': 0,
    'b': height,
    'h': height,
    'hd2': height / 2,
    'hd4': height / 4,
    'hd5': height / 5,
    'hd6': height / 6,
    'hd8': height / 8,
    'hd10': height / 10,
    'vc': height / 2,
    'ls': max,
    'ss': min,
    'ssd2': min / 2,
    'ssd4': min / 4,
    'ssd5': min / 5,
    'ssd6': min / 6,
    'ssd8': min / 8,
    'ssd10': min / 10,
    'ssd16': min / 16,
    'ssd32': min / 32,
    '3cd4': Number(OOXMLValue.stringify((360 * 3) / 4, 'degree')),
    '3cd8': Number(OOXMLValue.stringify((360 * 3) / 8, 'degree')),
    '5cd8': Number(OOXMLValue.stringify((360 * 5) / 8, 'degree')),
    '7cd8': Number(OOXMLValue.stringify((360 * 7) / 8, 'degree')),
    'cd2': Number(OOXMLValue.stringify(360 / 2, 'degree')),
    'cd4': Number(OOXMLValue.stringify(360 / 4, 'degree')),
    'cd8': Number(OOXMLValue.stringify(360 / 8, 'degree')),
  }

  function parse(variable: string): number {
    if (variable in variables) {
      return variables[variable]
    }

    const after = vars.find(item => item[0] === variable)
    if (after) {
      return parse(after[1])
    }

    const [command, ...args] = variable.split(' ')

    let res: number
    if (command === '*/') {
      res = (parse(args[0]) * parse(args[1])) / parse(args[2])
    }
    else if (command === '+-') {
      res = parse(args[0]) + parse(args[1]) - parse(args[2])
    }
    else if (command === '+/') {
      res = (parse(args[0]) + parse(args[1])) / parse(args[2])
    }
    else if (command === '?:') {
      res = parse(args[0]) > 0 ? parse(args[1]) : parse(args[2])
    }
    else if (command === 'abs') {
      res = Math.abs(parse(args[0]))
    }
    else if (command === 'max') {
      res = Math.max(parse(args[0]), parse(args[1]))
    }
    else if (command === 'min') {
      res = Math.min(parse(args[0]), parse(args[1]))
    }
    else if (command === 'mod') {
      res = Math.sqrt(
        parse(args[0]) * parse(args[0]) + parse(args[1]) * parse(args[1]) + parse(args[2]) * parse(args[2]),
      )
    }
    else if (command === 'pin') {
      res
        = parse(args[1]) < parse(args[0])
          ? parse(args[0])
          : parse(args[1]) > parse(args[2])
            ? parse(args[2])
            : parse(args[1])
    }
    else if (command === 'sqrt') {
      res = Math.sqrt(parse(args[0]))
    }
    else if (command === 'val') {
      res = Number(args[0])
    }

    // 角度计算部分
    else if (command === 'at2') {
      res = Number(OOXMLValue.stringify((Math.atan2(parse(args[1]), parse(args[0])) / Math.PI) * 180, 'degree'))
    }
    else if (command === 'cat2') {
      res = parse(args[0]) * Math.cos(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (command === 'sat2') {
      res = parse(args[0]) * Math.sin(Math.atan2(parse(args[2]), parse(args[1])))
    }
    else if (command === 'cos') {
      res = parse(args[0]) * Math.cos((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (command === 'sin') {
      res = parse(args[0]) * Math.sin((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else if (command === 'tan') {
      res = parse(args[0]) * Math.tan((OOXMLValue.parse(String(parse(args[1])), 'degree') / 180) * Math.PI)
    }
    else {
      res = Number(variable)
    }
    variables[variable] = res
    return res
  }
  // vars = [...vars];
  // while (vars.length) {
  //     const [name, value] = vars.shift()!;
  //     variables[name] = parse(value);
  // }
  for (const item of vars) {
    const [name, value] = item
    variables[name] = parse(value)
  }

  return variables
}

export class _Geometry extends OOXML {
  @defineChild('a:avLst') declare avLst?: AdjustValueList

  getCommands(
    pathLst?: PathList,
    avLst?: AdjustValueList,
    gdLst?: ShapeGuideList,
  ) {
    const gd = gdLst?.value.map(gd => ({ name: gd.name, fmla: gd.fmla }))
    const av = avLst?.value.map(av => ({ name: av.name, fmla: av.fmla }))

    pathLst?.value.forEach((path) => {
      const { w, h, commands, fill, stroke } = path

      commands.forEach((cmd) => {
        switch (cmd.type) {
          case 'Q':
            break
        }
      })
    })
  }
}
