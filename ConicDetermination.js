function decToFrac(value, donly = true) {
  var tolerance = 1.0E-10; 
  var h1 = 1;
  var h2 = 0;
  var k1 = 0;
  var k2 = 1;
  var negative = false;
  var i;

  // Integer case, stop the script
  if (parseInt(value) == value) { 
    return value;
  } else if (value < 0) {
    negative = true;
    value = -value;
  }

  if (donly) {
    i = parseInt(value);
    value -= i;
  }

  var b = value;

  do {
    var a = Math.floor(b);
    console.log(a)
    var aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(value - h1 / k1) > value * tolerance);

  return (negative ? "-" : '') + ((donly & (i != 0)) ? i + ' ' : '') + (h1 == 0 ? '' : `\\frac{${h1}}{${k1}}`);
}

function determination(a, b, c, d, e, f) {
    var Det = (a*c*f) - (((d**2)*c + (b**2)*f + (e**2)*a - b*e*d))/4
    
    console.log(a,b,c,d,e,f, typeof Det)
    
    var t = a + c
    var coft1 = c*f - ((e/2)**2)
    var coft2 = a*f - ((d/2)**2)
    var coft3 = a*c - ((b/2)**2)

    /* Determine the type of the conic given her coefficientes AX² + BXY + CY² + DX + EY + F = 0
        0 -> Empty
        1 -> Point  
        2 -> Two Identical Lines
        3 -> Pair of parallel lines (non identical)
        4 -> Pair of intersecting lines
        5 -> Line
        6 -> Ellipse
        7 -> Hyperbola
        8 -> Parabola
        9 -> Cirfunferemce
    */
    var type
    if (((coft3 > 0) && (t.Det > 0)) || ((coft3 == 0) && (Det == 0) && (coft1 + coft2 > 0))) {
        document.getElementById("Type").innerText = "Empty"
        type = 0
    }
    else if ((coft3 > 0) && (Det == 0)) {
        document.getElementById("Type").innerText = "Point"
        type = 1
    }
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 == 0)) {
        document.getElementById("Type").innerText = "Pair of identical lines" 
        type = 2
    }
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 < 0) && ((a != 0) || (b != 0) || (c != 0))) {
        document.getElementById("Type").innerText = "Pair parallel lines"
        type = 3
    }
    else if ((coft3 < 0) && (Det == 0)) {
        document.getElementById("Type").innerText = "Pair of intersecting lines" 
        type = 4
    }
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 < 0) && ((a == 0) && (b == 0) && (c == 0))) {
        document.getElementById("Type").innerText = "Line"
        type = 5
    }
    else if ((coft3 > 0) && (t.Det < 0) && (a != c)) {
        document.getElementById("Type").innerText = "Ellipse" 
        type = 6
    }
    else if ((coft3 < 0) && (Det != 0)) {
        document.getElementById("Type").innerText = "Hyperbola" 
        type = 7
    }
    else if ((coft3 == 0) && (Det != 0)) {
        document.getElementById("Type").innerText = "Parabola" 
        type = 8
    }    
    else if ((coft3 > 0) && (t.Det < 0) && (a == c)) {
        document.getElementById("Type").innerText = "Circumference (Ellipse)" 
        type = 9
    }    

    return type
    // if (!coft3) {
    //     if (!Det) {
    //         if (!(coft1 + coft2)) {
    //             document.getElementById("Type").innerText = "Pair of identical lines" 
    //             type = 2
    //         }
    //         else if(coft1 + coft2 > 0) {
    //             document.getElementById("Type").innerText = "Empty" 
    //             type = 0
    //         }
    //         else {
    //             if (!a && !b && !c) {
    //                 document.getElementById("Type").innerText = "Line"
    //                 type = 5
    //             }
    //             else {
    //                 document.getElementById("Type").innerText = "Pair parallel lines"
    //                 type = 3
    //             }    
    //         }        
    //     } 
    //     else {
    //         document.getElementById("Type").innerText = "Parabola"            
    //         type = 8
    //     }
    // }
    // else if(coft3 > 0) {
    //     if (!Det) {
    //         document.getElementById("Type").innerText = "Point"
    //         type = 1
    //     }
    //     else {
    //         if (t*Det > 0) {
    //             document.getElementById("Type").innerText = "Empty"
    //             type = 0
    //         }
    //         else {
    //             if (a == c) {
    //                 document.getElementById("Type").innerText = "Circumference (Ellipse)" 
    //                 type = 9
    //             }
    //             else {
    //                 document.getElementById("Type").innerText = "Ellipse" 
    //                 type = 6
    //             } 
    //         }
    //     }
    // }
    // else {
    //     if (!Det) {
    //         document.getElementById("Type").innerText = "Pair of intersecting lines" 
    //         type = 4
    //     }
    //     else {
    //         document.getElementById("Type").innerText = "Hyperbola" 
    //         type = 7
    //     }
    // }
}

function findElements(type, a, b, c, d, e, f) {
    var f1, f2
    var exc 
    var v1, v2
    var b1,b2
    var string = ""
    var p 
    var center
    var radiun
    
    document.getElementById("ElTitle").innerText = "Elements"       
    // Ellipse
    if (type == 6) {
        v1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/a) : (-f/c))
        v2 = -v1
        if (a < c) string += `First Vertice (A1): (${v1},0) Second Vertice (A2): (${v2},0).`
        else string += `First Vertice (A1): (0,${v1}) Second Vertice (A2): (0,${v2}).`
        string += "\n---------------------------------------------------------------------------------------------------\n"

        b1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/c) : (-f/a))
        b2 = -b1
        if (a < c) string += `Third Vertice  (B1): (0,${b1}) . Fourth Vertice (B2): (0,${b2}).`
        else string += `Third Vertice (B1): (${b1},0) . Fourth Vertice (B2): (${b2},0).`
        string += "\n---------------------------------------------------------------------------------------------------\n"

        f1 = Math.sqrt((v1**2) - (b1**2))
        f2 = -f1
        if (a < c) string += `First Focus (F1): (${f1},0) . Second Focus (F2): (${f2},0).`
        else string += `First Focus (F1): (0,${f1}) . Second Focus (F2): (0,${f2}).`
        string += "\n---------------------------------------------------------------------------------------------------\n"

        exc = f1/v1
        string += `Excentricite : ${exc}`

        document.getElementById("Elements").innerText = string
    }
    // Hyperbola
    else if (type == 7) {
        v1 = Math.sqrt((-f/a > 0)?(-f/a):(f/c))
        v2 = -v1   
        if (a > 0) string += `First Vertice (A1): (${v1},0) Second Vertice (A2): (${v2},0).`
        else string += `First Vertice (A1): (0,${v1}) Second Vertice (A2): (0,${v2}).`
        string += "\n---------------------------------------------------------------------------------------------------\n"
        
        f1 = Math.sqrt(v1**2 + ((a>0)?(-f/c):(-f/a))**2)
        f2 = -f1
        if (a > 0) string += `First Focus (F1): (${f1},0) Second Focus (F2): (${f2},0).`
        else string += `First Focus (F1): (0,${f1}) Second Focus (F2): (0,${f2}).`
        string += "\n---------------------------------------------------------------------------------------------------\n"

        exc = f1/v1
        string += `Excentricite : ${exc}`   

        document.getElementById("Elements").innerText = string       
    }
    // Parabola
    else if (type == 8) {
        if (!a) {
            if (c>0) p = -d/4
            else p = d/4
            string = `P = ${p}, and the focus is at F (${p},0)`             
        }
        if (!c) {
            if (a>0) p = -e/4
            else p = e/4
            string += `P = ${p}, and the focus is at F (0,${p})` 
       }
       document.getElementById("Elements").innerText = string
    }
    // Circumference
    else if (type == 9){
        if (a < 0) radius = Math.sqrt(f)
        else radius = Math.sqrt(-f)
        string = `The radius of the circumference is ${radius}`
        document.getElementById("Elements").innerText = string
    }
}

function auxPrintEquation(coef, add, string) {
    var temp = ""

    if (coef > 0) {
        temp = decToFrac(coef, false)
        if (string) string += "+ "
        string += `${temp}${add}`    
    }
    else if (coef < 0) {
        temp = decToFrac(-coef, false)
        string += `- ${temp}${add}`    
    }

    return string
}

function printEquation(a, b, c, d, e, f) {
    var string = ""

    string = auxPrintEquation(a, "X^2 ", string)
    string = auxPrintEquation(b, "XY ", string)
    string = auxPrintEquation(c, "Y^2 ", string)
    string = auxPrintEquation(d, "X ", string)
    string = auxPrintEquation(e, "Y ", string)
    string = auxPrintEquation(f, " ", string)

    if (string) string += " = 0 "
    else string = "Not an equation..."
    
    return string
}

function graph() {
    // Getting all coefficients 
    var a = eval(document.getElementById("a").value) || 0
    var b = eval(document.getElementById("b").value) || 0
    var c = eval(document.getElementById("c").value) || 0
    var d = eval(document.getElementById("d").value) || 0
    var e = eval(document.getElementById("e").value) || 0
    var f = eval(document.getElementById("f").value) || 0
    
    var type = determination(a,b,c,d,e,f)

    let equation = printEquation(a,b,c,d,e,f)    
    katex.render(equation, document.getElementById("equation", {
        trowOnError: false
    }))

    var a2 = a
    var b2 = b
    var c2 = c
    var d2 = d
    var e2 = e
    var f2 = f
    var h, k
    
    const det = a*c - (b/2)**2
    var flagFirstDet = det
    
    if((d != 0) || (e != 0)) {
        if (flagFirstDet == 0) {
            document.getElementById("notdet").innerText = "It was not possible to make a translation of the coordenate system"
        }
        else{
            h = ((-d/2) * c - (-e/2) * (b/2))/det
            k = ((a) * (-e/2) - (b/2) * (-d/2))/det
            d2 = 0
            e2 = 0
            f2 = ((d/2)*h + (e/2)*k + f)
            
            var temp1 = decToFrac(h, false)
            var temp2 = decToFrac(k, false)            
            document.getElementById("anshk").innerHTML = `
                The new coordenate system has 
                (<span id="coordenada1"></span>, 
                <span id="coordenada2"></span>)
                as his origen coordernates at the old system ` 
            katex.render(temp1, document.getElementById("coordenada1"), {
                trowOnError: false
            })
            katex.render(temp2, document.getElementById("coordenada2"), {
                trowOnError: false
            })
                   
            let neweq = printEquation(a2,b2,c2,d2,e2,f2)

            katex.render(neweq, document.getElementById("neweq", {
                trowOnError: false
            }))
        }
    }
    else document.getElementById("anshk").innerText = "Translation unnecessary"
    
    if(b2 != 0) {
        var tanteta1 = (2*a - 2*c + Math.sqrt((2*a - 2*c)**2 + 4*b**2))/(-2*b)
        var teta1 = (Math.atan(tanteta1))*(180/Math.PI)
        var teta1rad = Math.atan(tanteta1)

        a2 = (a + c + b*Math.sqrt(1+((a-c)/b)**2))/2 
        b2 = 0
        c2 = a + c - a2
       
        var cos1 = Math.sqrt(1/(tanteta1**2 + 1))
        var sin1 = Math.sqrt(1 - (cos1)**2)
           
        if (flagFirstDet == 0) {
            d2 = d*cos1 + e*sin1
            e2 = (-d)*sin1 + e*cos1
        }

        let neweq2 = printEquation(a2,b2,c2,d2,e2,f2)    
        katex.render(neweq2, document.getElementById("neweq2", {
            trowOnError: false
        }))

        document.getElementById("anstetas").innerText =  `We have for rotation : first angle ${teta1.toFixed(2)}`
    }
    else document.getElementById("anstetas").innerText = "Rotation unnecessary"
    
    if (type > 5) findElements(type, a2,b2,c2,d2,e2,f2)
}