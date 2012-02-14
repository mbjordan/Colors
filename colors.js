/*
Colors JS Library v1.0
Copyright 2012 Matthew B. Jordan
Licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. (http://creativecommons.org/licenses/by-sa/3.0/)
http://matthewbjordan.me/colors
*/
var Colors = {
    rgb2hex: function (rgbv) {
        if (typeof rgbv == 'object') {
            var h = '#';
            for (x in rgbv) {
                var hex = rgbv[x].toString(16);
                if (hex.length == 1) hex = '0' + hex;
                h = h + hex
            }
            return h
        } else {
            var hex = rgbv.toString(16);
            if (hex.length == 1) hex = '0' + hex;
            return hex
        }
    },
    hex2rgb: function (h) {
        h = h.replace('#', '');
        if (h.length === 6) {
            return {
                'R': parseInt(h.substr(0, 2), 16),
                'G': parseInt(h.substr(2, 2), 16),
                'B': parseInt(h.substr(4, 2), 16),
                'RGB': parseInt(h.substr(0, 2), 16) + ' ' + parseInt(h.substr(2, 2), 16) + ' ' + parseInt(h.substr(4, 2), 16),
                'a': [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]
            }
        } else {
            return parseInt(h, 16)
        }
    },
    hex2hsv: function (h) {
        h = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
        var r = parseInt(h.substring(0, 2), 16) / 255,
            g = parseInt(h.substring(2, 4), 16) / 255,
            b = parseInt(h.substring(4, 6), 16) / 255,
            result = {
                'h': 0,
                's': 0,
                'v': 0
            },
            minVal = Math.min(r, g, b),
            maxVal = Math.max(r, g, b),
            delta = (maxVal - minVal);
        result.v = maxVal;
        if (delta == 0) {
            result.h = 0;
            result.s = 0
        } else {
            result.s = delta / maxVal;
            var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
            var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
            var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
            if (r == maxVal) result.h = del_B - del_G;
            else if (g == maxVal) result.h = (1 / 3) + del_R - del_B;
            else if (b == maxVal) result.h = (2 / 3) + del_G - del_R;
            if (result.h < 0) result.h += 1;
            if (result.h > 1) result.h -= 1
        }
        var rh = Math.round(result.h * 360),
            rs = Math.round(result.s * 100),
            rv = Math.round(result.v * 100);
        return {
            'H': rh,
            'S': rs,
            'V': rv,
            'HSV': rh + ' ' + rs + ' ' + rv,
            'a': [rh, rs, rv]
        }
    },
    hsv2rgb: function (HSV, S, V) {
        if (typeof HSV == 'object') {
            var h = HSV[0],
                s = HSV[1],
                v = HSV[2]
        } else {
            var h = HSV,
                s = S,
                v = V
        }
        var s = s / 100,
            v = v / 100;
        var hi = Math.floor((h / 60) % 6);
        var f = (h / 60) - hi;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var rgb = [];
        switch (hi) {
        case 0:
            rgb = [v, t, p];
            break;
        case 1:
            rgb = [q, v, p];
            break;
        case 2:
            rgb = [p, v, t];
            break;
        case 3:
            rgb = [p, q, v];
            break;
        case 4:
            rgb = [t, p, v];
            break;
        case 5:
            rgb = [v, p, q];
            break
        }
        var r = Math.min(255, Math.floor(rgb[0] * 256)),
            g = Math.min(255, Math.floor(rgb[1] * 256)),
            b = Math.min(255, Math.floor(rgb[2] * 256));
        return {
            'R': r,
            'G': g,
            'B': b,
            'RGB': r + ' ' + g + ' ' + b,
            'a': [r, g, b]
        }
    },
    rgb2hsl: function (RGB, G, B) {
        if (typeof RGB == 'object') {
            var r = RGB[0],
                g = RGB[1],
                b = RGB[2]
        } else {
            var r = RGB,
                g = G,
                b = B
        }
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break
            }
            h /= 6
        }
        var H = Math.floor(h * 360),
            S = Math.floor(s * 100),
            L = Math.floor(l * 100);
        return {
            'H': H,
            'S': S,
            'L': L,
            'HSL': H + ' ' + S + ' ' + L,
            'a': [H, S, L]
        }
    },
    hsv2hsl: function (HSV, S, V) {
        if (typeof HSV == 'object') {
            var h = HSV[0],
                s = HSV[1],
                l = HSV[2]
        } else {
            var h = HSV,
                s = S,
                l = V
        }
        var hsv = this.hsv2rgb(h, s, l),
            r1 = hsv.R / 255,
            g1 = hsv.G / 255,
            b1 = hsv.B / 255;
        var maxColor = Math.max(r1, g1, b1),
            minColor = Math.min(r1, g1, b1),
            L = (maxColor + minColor) / 2,
            S = 0,
            H = 0;
        if (maxColor != minColor) {
            if (L < 0.5) {
                S = (maxColor - minColor) / (maxColor + minColor)
            } else {
                S = (maxColor - minColor) / (2.0 - maxColor - minColor)
            }
            if (r1 == maxColor) {
                H = (g1 - b1) / (maxColor - minColor)
            } else if (g1 == maxColor) {
                H = 2.0 + (b1 - r1) / (maxColor - minColor)
            } else {
                H = 4.0 + (r1 - g1) / (maxColor - minColor)
            }
        }
        L = L * 100;
        S = S * 100;
        H = H * 60;
        if (H < 0) {
            H += 360
        }
        return {
            'H': Math.floor(H),
            'S': Math.floor(S),
            'L': Math.floor(L),
            'HSL': Math.floor(H) + ' ' + Math.floor(S) + ' ' + Math.floor(L),
            'a': [Math.floor(H), Math.floor(S), Math.floor(V)]
        }
    },
    name2hex: function (n) {
        n = n.toLowerCase();
        var nar = {
            'aliceblue': '#f0f8ff',
            'antiquewhite': '#faebd7',
            'aqua': '#00ffff',
            'aquamarine': '#7fffd4',
            'azure': '#f0ffff',
            'beige': '#f5f5dc',
            'bisque': '#ffe4c4',
            'black': '#000000',
            'blanchedalmond': '#ffebcd',
            'blue': '#0000ff',
            'blueviolet': '#8a2be2',
            'brown': '#a52a2a',
            'burlywood': '#deb887',
            'cadetblue': '#5f9ea0',
            'chartreuse': '#7fff00',
            'chocolate': '#d2691e',
            'coral': '#ff7f50',
            'cornflowerblue': '#6495ed',
            'cornsilk': '#fff8dc',
            'crimson': '#dc143c',
            'cyan': '#00ffff',
            'darkblue': '#00008b',
            'darkcyan': '#008b8b',
            'darkgoldenrod': '#b8860b',
            'darkgray': '#a9a9a9',
            'darkgrey': '#a9a9a9',
            'darkgreen': '#006400',
            'darkkhaki': '#bdb76b',
            'darkmagenta': '#8b008b',
            'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00',
            'darkorchid': '#9932cc',
            'darkred': '#8b0000',
            'darksalmon': '#e9967a',
            'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b',
            'darkslategray': '#2f4f4f',
            'darkslategrey': '#2f4f4f',
            'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3',
            'deeppink': '#ff1493',
            'deepskyblue': '#00bfff',
            'dimgray': '#696969',
            'dimgrey': '#696969',
            'dodgerblue': '#1e90ff',
            'firebrick': '#b22222',
            'floralwhite': '#fffaf0',
            'forestgreen': '#228b22',
            'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc',
            'ghostwhite': '#f8f8ff',
            'gold': '#ffd700',
            'goldenrod': '#daa520',
            'gray': '#808080',
            'grey': '#808080',
            'green': '#008000',
            'greenyellow': '#adff2f',
            'honeydew': '#f0fff0',
            'hotpink': '#ff69b4',
            'indianred': '#cd5c5c',
            'indigo': '#4b0082',
            'ivory': '#fffff0',
            'khaki': '#f0e68c',
            'lavender': '#e6e6fa',
            'lavenderblush': '#fff0f5',
            'lawngreen': '#7cfc00',
            'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6',
            'lightcoral': '#f08080',
            'lightcyan': '#e0ffff',
            'lightgoldenrodyellow': '#fafad2',
            'lightgray': '#d3d3d3',
            'lightgrey': '#d3d3d3',
            'lightgreen': '#90ee90',
            'lightpink': '#ffb6c1',
            'lightsalmon': '#ffa07a',
            'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa',
            'lightslategray': '#778899',
            'lightslategrey': '#778899',
            'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0',
            'lime': '#00ff00',
            'limegreen': '#32cd32',
            'linen': '#faf0e6',
            'magenta': '#ff00ff',
            'maroon': '#800000',
            'mediumaquamarine': '#66cdaa',
            'mediumblue': '#0000cd',
            'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8',
            'mediumseagreen': '#3cb371',
            'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a',
            'mediumturquoise': '#48d1cc',
            'mediumvioletred': '#c71585',
            'midnightblue': '#191970',
            'mintcream': '#f5fffa',
            'mistyrose': '#ffe4e1',
            'moccasin': '#ffe4b5',
            'navajowhite': '#ffdead',
            'navy': '#000080',
            'oldlace': '#fdf5e6',
            'olive': '#808000',
            'olivedrab': '#6b8e23',
            'orange': '#ffa500',
            'orangered': '#ff4500',
            'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa',
            'palegreen': '#98fb98',
            'paleturquoise': '#afeeee',
            'palevioletred': '#d87093',
            'papayawhip': '#ffefd5',
            'peachpuff': '#ffdab9',
            'peru': '#cd853f',
            'pink': '#ffc0cb',
            'plum': '#dda0dd',
            'powderblue': '#b0e0e6',
            'purple': '#800080',
            'red': '#ff0000',
            'rosybrown': '#bc8f8f',
            'royalblue': '#4169e1',
            'saddlebrown': '#8b4513',
            'salmon': '#fa8072',
            'sandybrown': '#f4a460',
            'seagreen': '#2e8b57',
            'seashell': '#fff5ee',
            'sienna': '#a0522d',
            'silver': '#c0c0c0',
            'skyblue': '#87ceeb',
            'slateblue': '#6a5acd',
            'slategray': '#708090',
            'slategrey': '#708090',
            'snow': '#fffafa',
            'springgreen': '#00ff7f',
            'steelblue': '#4682b4',
            'tan': '#d2b48c',
            'teal': '#008080',
            'thistle': '#d8bfd8',
            'tomato': '#ff6347',
            'turquoise': '#40e0d0',
            'violet': '#ee82ee',
            'wheat': '#f5deb3',
            'white': '#ffffff',
            'whitesmoke': '#f5f5f5',
            'yellow': '#ffff00',
            'yellowgreen': '#9acd32'
        };
        var r = nar[n];
        if (r == undefined) return 'Invalid Color Name';
        else
        return r
    },
    name2rgb: function (n) {
        var v = this.name2hex(n),
            t = /^[a-fA-F0-9#]{7}$/,
            icn = 'Invalid Color Name';
        if (t.test(v)) return this.hex2rgb(v);
        else
        return {
            'R': icn,
            'G': icn,
            'B': icn,
            'RGB': icn,
            'a': icn
        }
    },
    name2hsv: function (n) {
        var v = this.name2hex(n),
            t = /^[a-fA-F0-9#]{7}$/,
            icn = 'Invalid Color Name';
        if (t.test(v)) return this.hex2hsv(v);
        else
        return {
            'H': icn,
            'S': icn,
            'V': icn,
            'HSV': icn,
            'a': icn
        };
    },
    complement: function (c, g, b) {
        if (typeof c == 'string' && /(#([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/.test(c)) {
            c = c.replace('#', '');
            var rtn = '#';
            if (c.length === 6) {
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(0, 2)));
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(2, 2)));
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(4, 2)));
            }
            if (c.length === 3) {
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(0, 1) + c.substr(0, 1)));
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(1, 1) + c.substr(1, 1)));
                rtn += this.rgb2hex(255 - this.hex2rgb(c.substr(2, 1) + c.substr(2, 1)));
            }
            return rtn;
        }
        if (c != undefined && g != undefined && b != undefined) {
            return {
                'R': 255 - c,
                'G': 255 - g,
                'B': 255 - b,
                'RGB': (255 - c) + ' ' + (255 - g) + ' ' + (255 - b),
                'a': [(255 - c), (255 - g), (255 - b)]
            };
        }
        if (typeof c == 'object') {
            return {
                'R': 255 - c[0],
                'G': 255 - c[1],
                'B': 255 - c[2],
                'RGB': (255 - c[0]) + ' ' + (255 - c[1]) + ' ' + (255 - c[2]),
                'a': [(255 - c[0]), (255 - c[1]), (255 - c[2])]
            };
        }
    },
    rand: function (mode) {
        if (mode == 'hex' || mode == undefined) {
            var chars = '0123456789abcdef',
                string_length = 6,
                hexStr = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                hexStr += chars.substring(rnum, rnum + 1)
            }
            return '#' + hexStr
        } else if (mode == 'rgb') {
            var minx = 0,
                maxx = 255;
            R = Math.floor(Math.random() * (minx - maxx + 1) + maxx), G = Math.floor(Math.random() * (minx - maxx + 1) + maxx), B = Math.floor(Math.random() * (minx - maxx + 1) + maxx);
            return {
                'R': R,
                'G': G,
                'B': B,
                'RGB': R + ' ' + G + ' ' + B,
                'a': [R, G, B]
            }
        }
    }
};