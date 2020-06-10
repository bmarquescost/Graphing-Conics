  
function decToFrac(value, donly = true) {
    let tolerance = 1.0E-10; 
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let negative = false;
    let i;

    // Integer case, stop the script
    if (parseInt(value) == value) { 
        return value;
    } else if (value < 0) {
        negative = true;
        value = -value;
    }

    if (donly) {
        i = parseFloat(value);
        value -= i;
    }

    let b = value;

    do {
        let a = Math.floor(b);
        console.log(a)
        let aux = h1;
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
    let Det = (a*c*f) - (((d**2)*c + (b**2)*f + (e**2)*a - b*e*d))/4
    
    console.log(a,b,c,d,e,f, typeof Det)
 
    let t = a + c
    let coft1 = c*f - ((e/2)**2)
    let coft2 = a*f - ((d/2)**2)
    let coft3 = a*c - ((b/2)**2)

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

    let type

    if (((coft3 > 0) && (t * Det > 0)) || ((coft3 == 0) && (Det == 0) && (coft1 + coft2 > 0))) {
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
    else if ((coft3 > 0) && (t * Det < 0) && (a != c)) {
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
    else if ((coft3 > 0) && (t * Det < 0) && (a == c)) {
        document.getElementById("Type").innerText = "Circumference (Ellipse)" 
        type = 9
    }    

    return type
}

function findElements(type, a, b, c, d, e, f) {
    let f1, f2
    let exc 
    let v1, v2
    let b1,b2
    let string = ""
    let p 
    let center
    let radiun

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
        if (a < c) string += `Third Vertice  (B1): (0, ${b1}) . Fourth Vertice (B2): (0, ${b2}).`
        else string += `Third Vertice (B1): (${b1}, 0) . Fourth Vertice (B2): (${b2}, 0).`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"

        f1 = Math.sqrt((v1**2) - (b1**2))
        f2 = -f1
        if (a < c) string += `First Focus (F1): (${f1}, 0) . Second Focus (F2): (${f2}, 0).`
        else string += `First Focus (F1): (0, ${f1}) . Second Focus (F2): (0, ${f2}).`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        string += `Excentricite : <span id="excentricite"></span>`
        document.getElementById("Elements").innerHTML = string;

        exc = f1/v1;
        exc = decToFrac(exc, false);

        katex.render(exc, document.getElementById("excentricite"), {
            trowOnError: false
        })
    }
    // Hyperbola
    else if (type == 7) {
        let resultado = (-f/a > 0) ? (-f/a):(f/c);
        resultado = Math.abs(resultado);

        v1 = Math.sqrt(resultado);
        v2 = -v1   
        if (a > 0) string += `First Vertice (A1): (${v1},0) Second Vertice (A2): (${v2},0).`
        else string += `First Vertice (A1): (0,${v1}) Second Vertice (A2): (0,${v2}).`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        
        f1 = Math.sqrt(v1**2 + ((a>0)?(-f/c):(-f/a))**2)
        f2 = -f1
        if (a > 0) string += `First Focus (F1): (${f1},0) Second Focus (F2): (${f2},0).`
        else string += `First Focus (F1): (0,${f1}) Second Focus (F2): (0,${f2}).`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        string += `Excentricite : <span id="excentricite"></span>`
        document.getElementById("Elements").innerHTML = string;

        exc = f1/v1;
        exc = decToFrac(exc, false);

        katex.render(exc, document.getElementById("excentricite"), {
            trowOnError: false
        })
    }

    // Parabola
    else if (type == 8) {
        if (!a) {
            if (c>0) p = -d/(4*c);
            else p = d/(4*c);
            string = `P = ${p}, and the focus is at F (${p},0)`             
        }
        if (!c) {
            if (a>0) p = -e/(4*a);
            else p = e/(4*a);
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
    let temp = ""

    if (coef > 0) {
        temp = decToFrac(coef, false)
        if (string) string += "+ "
        if (add == " ") string += `${temp}`    
        if (temp != 1) string += `${temp}`
        string += `${add}`    
    }
    else if (coef < 0) {
        temp = decToFrac(-coef, false)
        if (temp != 1) string += `- ${temp}`
        else { 
            if (add == " ") string += `- ${temp}`    
        }  
        string += `${add}`    
    }

    return string
}

function printEquation(a, b, c, d, e, f, x, y) {
    let string = ""

    string = auxPrintEquation(a, `${x}^2 `, string)
    string = auxPrintEquation(b, `${x}${y}`, string)
    string = auxPrintEquation(c, `${y}^2 `, string)
    string = auxPrintEquation(d, `${x} `, string)
    string = auxPrintEquation(e, `${y} `, string)
    string = auxPrintEquation(f, " ", string)

    if (string) string += " = 0 "
    else string = "Not an equation..."
    
    return string
}

function mmc(a,b,c,d,e,f) {

    let coefs = [a, b, c, d, e, f]
    for (let i = 0; i < 6; i++) {
        if (parseInt(coefs[i]) != coefs[i]) return coefs
    }

    coefs = coefs.map(coefieciente => (Math.abs(coefieciente)))
    coefs = coefs.sort((a, b) => a - b);

    let i = 0
    while (!coefs[i]) i++
    let num = coefs[i]
    
    coefs = [a, b, c, d, e, f]

    for (div = 2; num > 1; div++) {
        if (num % div != 0) continue
        
        while (num % div == 0) {
            num /= div
            if ((coefs[0] % div == 0) && (coefs[1] % div == 0) && (coefs[2] % div == 0) && (coefs[3] % div == 0) && (coefs[4] % div == 0) && (coefs[5] % div)== 0) {
                for (let i = 0; i < 6; i++) coefs[i] /= div
            }             
        }
    }

    return coefs
}

function graph() {
    // Getting all coefficients 
    
    let a = parseFloat(document.getElementById("coefA").value) || 0
    let b = parseFloat(document.getElementById("coefB").value) || 0
    let c = parseFloat(document.getElementById("coefC").value) || 0
    let d = parseFloat(document.getElementById("coefD").value) || 0
    let e = parseFloat(document.getElementById("coefE").value) || 0
    let f = parseFloat(document.getElementById("coefF").value) || 0

    let type = determination(a,b,c,d,e,f)

    let equation = printEquation(a,b,c,d,e,f,"x","y")
    katex.render(equation, document.getElementById("equation", {
        trowOnError: false
    }))

    let a2 = a
    let b2 = b
    let c2 = c
    let d2 = d
    let e2 = e
    let f2 = f
    let h, k
    
    const det = a*c - (b/2)**2
    let flagFirstDet = det
    
    if((d != 0) || (e != 0)) {
        if (flagFirstDet == 0) {
            document.getElementById("answerHK").innerText = "It was not possible to make a translation of the coordenate system"
        }
        else{
            h = ((-d/2) * c - (-e/2) * (b/2))/det
            k = ((a) * (-e/2) - (b/2) * (-d/2))/det
            d2 = 0
            e2 = 0
            f2 = ((d/2)*h + (e/2)*k + f)
            
            let temp1 = decToFrac(h, false)
            let temp2 = decToFrac(k, false)
            
            if (typeof(temp1) === "number") {temp1 = temp1.toString();}
            if (typeof(temp2) === "number") {temp2 = temp2.toString();}
            
            document.getElementById("answerHK").innerHTML = `
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

            let coefs = mmc(a2,b2,c2,d2,e2,f2)
            a2 = coefs[0]
            b2 = coefs[1]
            c2 = coefs[2]
            d2 = coefs[3]
            e2 = coefs[4]
            f2 = coefs[5]

            let neweq = printEquation(a2,b2,c2,d2,e2,f2,"u","v")
            if (typeof(neweq) === "number") {neweq = neweq.toString();}
            katex.render(neweq, document.getElementById("firstEquation", {
                trowOnError: false
            }))
        }
    }
    else document.getElementById("answerHK").innerText = "Translation unnecessary"
    
    if(b2 != 0) {
        let tanteta1 = (2*a - 2*c + Math.sqrt((2*a - 2*c)**2 + 4*b**2))/(-2*b)
        let teta1 = (Math.atan(tanteta1))*(180/Math.PI)
        let teta1rad = Math.atan(tanteta1)

        a2 = (a + c + b*Math.sqrt(1+((a-c)/b)**2))/2 
        b2 = 0
        c2 = a + c - a2
       
        let cos1 = Math.sqrt(1/(tanteta1**2 + 1))
        let sin1 = Math.sqrt(1 - (cos1)**2)
           
        if (flagFirstDet == 0) {
            d2 = d*cos1 + e*sin1
            e2 = (-d)*sin1 + e*cos1
        }
        
        let coefs = mmc(a2,b2,c2,d2,e2,f2)
        a2 = coefs[0]
        b2 = coefs[1]
        c2 = coefs[2]
        d2 = coefs[3]
        e2 = coefs[4]
        f2 = coefs[5]

        let neweq2 = printEquation(a2,b2,c2,d2,e2,f2,"t","w")    
        if (typeof(neweq2) === "number") {neweq2 = neweq2.toString();}
        katex.render(neweq2, document.getElementById("secondEquation", {
            trowOnError: false
        }))

        document.getElementById("answerTetas").innerText =  `We have for rotation : first angle ${teta1.toFixed(2)}`
    }
    else document.getElementById("answerTetas").innerText = "Rotation unnecessary"
    
    if (type > 5) findElements(type, a2,b2,c2,d2,e2,f2)

    plotgraph(a2, b2, c2, d2, e2, f2, type);
    // plotgraph(a, b, c, d, e, f, type); ///////////////////////////////////////////////SE CHAMAR AS DUAS DE NAO PRINTA AS DUAS 

    // Criando gráfico
    // board.create('conic', [4, 7, -9, -2, 6, 3]);
    // board.create('conic', [3, 8, -24, 0, 0, 0])
}
/////////////////////////////////////////////////////////////////////////////////////////DAQUI PRA BAIXO MEXI EM TUDO
//Confere se eh diferença de quadrados pra facilitar plotagem das restas concorrentes
const isDiffSquares = (a, b, c, d, e, f, type) => {
    
    if (!b && !d && !e) {
        if (a * c < 0) {
            return 1
        }
        else return 0
    }
    else return 0
}

//Confere se eh quadrado perfeito pra facilitar plotagem da retas paralelas
const isPerfctSquare = (a, b, c, d, e, f, type) => {
    
    if (!d && !e && (f <= 0)) {
        if ((a > 0) && (c > 0)) {
            if (b < 0) {
                if (b = -2 * Math.sqrt(a * c)) {
                    return 1
                } 
                else return 0
            }
            else if (b > 0) {
                if (b = 2 * Math.sqrt(a * c)) {
                    return 1
                } 
                else return 0
            }
            else return 0
        }
        else return 0
    }
    else return 0
}

//Confere se eh algum caso do tipo x = k ou y = k, auxiliando na plotagem de retas coinscidentes e reta
//0: nao, 1: caso com x, 2: caso com y
const isBaseCase = (a, b, c, d, e, f, type) => {
    
    if (!a && !b && !c && d && !e) return 1 //Caso x = k = -f/d
    if (a && !b && !c && !d && !e) return 2 //Caso x² = 0
    if (!a && !b && !c && !d && e) return 3 //Caso y = k = -f/e
    if (!a && !b && c && !d && !e) return 4 //Caso y² = 0
}
// http://www.onemathematicalcat.org/Math/Precalculus_obj/conicDiscriminant.htm
// https://people.richland.edu/james/lecture/m116/conics/conics.html
// me baseei ai pra pensar nessas funções

const plotgraph = (a, b, c, d, e, f, type) => {

    alert(type);


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
    switch (type) {
        case 0: //empty
            break;
        case 1:
            board.create('point', [0, 0])
            break;
        case 2: //2 retas identicas
            let isBase2 = isBaseCase(a, b, c, d, e, f)
            let isPerfSqr2 = isPerfctSquare(a, b, c, d, e, f)
            console.log(a,b,c,d,e,f)
            if (isBase2) {
                if (isBase2 == 1) { // x = -f/d
                    board.create('line',[[-(f/d),0],[-(f/d),1]]);
                }
                else if (isBase2 == 2) { //x² = 0 ou x = -f/a
                    board.create('line',[[-(f/a),0],[-(f/a),1]]);
                }
                else if (isBase2 == 3) { // y = -f/e
                    board.create('line',[[0,-(f/e)],[1,-(f/e)]]);
                }
                else { //y² = 0 ou y = -f/c
                    board.create('line',[[0,-(f/c)],[1,-(f/c)]]);
                }
            }
            else if (isPerfSqr2) {
                if (b > 0) { //(ax + cy)² = -f
                    y0NegativeSqrt = -(Math.sqrt(-f)/c)
                    y0PositiveSqrt = (Math.sqrt(-f)/c)
                    y1NegativeSqrt = -(a + Math.sqrt(-f))/c
                    y1PositiveSqrt = (Math.sqrt(-f) - a)/c

                    board.create('line',[[0,y0NegativeSqrt],[1,y1NegativeSqrt]]);
                }
                else { //(ax - cy)² = -f
                    y0NegativeSqrt = -(Math.sqrt(-f)/c)
                    y0PositiveSqrt = (Math.sqrt(-f)/c)
                    y1NegativeSqrt = (a - Math.sqrt(-f))/c
                    y1PositiveSqrt = (a + Math.sqrt(-f))/c

                    board.create('line',[[0,y0NegativeSqrt],[1,y1NegativeSqrt]]);
                }
            }
            // else /////////////////////////////////////////////////////////EU ACHO QUE NAO TEM CASO DE RETAS IDENTICAS QUE NAO SEJA CASO BASE OU QUADRADO PERFEITO
// http://www.onemathematicalcat.org/Math/Precalculus_obj/conicDiscriminant.htm
// https://people.richland.edu/james/lecture/m116/conics/conics.html
            break;
        case 3: //2 paralelas
            let isBase3 = isBaseCase(a, b, c, d, e, f)
            let isPerfSqr3 = isPerfctSquare(a, b, c, d, e, f)
            if (isBase3) {
                if (isBase3 == 1) { // x = -f/d
                    board.create('line',[[-(f/d),0],[-(f/d),1]]);
                }
                else if (isBase3 == 2) { //x² = 0 ou x = -f/a
                    board.create('line',[[-(f/a),0],[-(f/a),1]]);
                }
                else if (isBase3 == 3) { // y = -f/e
                    board.create('line',[[0,-(f/e)],[1,-(f/e)]]);
                }
                else { //y² = 0 ou y = -f/c
                    board.create('line',[[0,-(f/c)],[1,-(f/c)]]);
                }
            }
            else if (isPerfSqr3) {
                if (b > 0) { //(ax + cy)² = -f
                    y0NegativeSqrt = -(Math.sqrt(-f)/c)
                    y0PositiveSqrt = (Math.sqrt(-f)/c)
                    y1NegativeSqrt = -(a + Math.sqrt(-f))/c
                    y1PositiveSqrt = (Math.sqrt(-f) - a)/c

                
                    board.create('line',[[0,y0NegativeSqrt],[1,y1NegativeSqrt]]);
                    board.create('line',[[0,y0PositiveSqrt],[1,y1PositiveSqrt]]); 
                }
                else { //(ax - cy)² = -f
                    y0NegativeSqrt = -(Math.sqrt(-f)/c)
                    y0PositiveSqrt = (Math.sqrt(-f)/c)
                    y1NegativeSqrt = (a - Math.sqrt(-f))/c
                    y1PositiveSqrt = (a + Math.sqrt(-f))/c

                    board.create('line',[[0,y0NegativeSqrt],[1,y1NegativeSqrt]]);
                    board.create('line',[[0,y0PositiveSqrt],[1,y1PositiveSqrt]]); 
                }
            }
            // else /////////////////////////////////////////////////////////EU ACHO QUE NAO TEM CASO DE RETAS PARALELAS QUE NAO SEJA CASO BASE OU QUADRADO PERFEITO
// http://www.onemathematicalcat.org/Math/Precalculus_obj/conicDiscriminant.htm
// https://people.richland.edu/james/lecture/m116/conics/conics.html
            break;
        case 4: //intersecção
            let isDiffSqrt = isDiffSquares(a,b,c,d,e,f)
            if (isDiffSqrt) { // ax² - cy² = (√(a)x + √(c)y) * (√(a)x + √(c)y) = 0
                y1SumCase = -Math.sqrt(Math.abs(a/c))
                y1SubCase = Math.sqrt(Math.abs(a/c))

                board.create('line',[[0,0],[1,y1SumCase]]);
                board.create('line',[[0,0],[1,y1SubCase]]); 
            }
            // else /////////////////////////////////////////////////////////EU ACHO QUE NAO TEM CASO DE RETAS CONCORRENTES QUE NAO SEJA CASO BASE OU QUADRADO PERFEITO
// http://www.onemathematicalcat.org/Math/Precalculus_obj/conicDiscriminant.htm
// https://people.richland.edu/james/lecture/m116/conics/conics.html
            break;
        case 5: //line
            let y0 = f
            let y1 = a + b + c + d + e + f
            board.create('line',[[0,y0],[1,y1]]);
            break;
        default:
            board.create('conic', [a, c, f, b/2, d/2, e/2]);
            // Ellipse
            if (type == 6) {
                v1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/a) : (-f/c))
                v2 = -v1
                if (a < c) {
                    board.create('point',[v1,0],{name:'A1',size:0.1});
                    board.create('point',[v2,0],{name:'A2',size:0.1});
                }
                else {
                    board.create('point',[0,v1],{name:'A1',size:0.1});
                    board.create('point',[0,v2],{name:'A2',size:0.1});
                }

                b1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/c) : (-f/a))
                b2 = -b1
                if (a < c) {
                    board.create('point',[0,b1],{name:'B1',size:0.1});
                    board.create('point',[0,b2],{name:'B2',size:0.1});
                }
                else {
                    board.create('point',[b1,0],{name:'B1',size:0.1});
                    board.create('point',[b2,0],{name:'B2',size:0.1});
                }

                f1 = Math.sqrt((v1**2) - (b1**2))
                f2 = -f1
                if (a < c) {
                    board.create('point',[f1,0],{name:'F1',size:0.1});
                    board.create('point',[f2,0],{name:'F2',size:0.1});
                }
                else {
                    board.create('point',[0,f1],{name:'F1',size:0.1});
                    board.create('point',[0,f2],{name:'F2',size:0.1});
                }
            }
            // Hyperbola
            else if (type == 7) {
                let resultado = (-f/a > 0) ? (-f/a):(f/c);
                resultado = Math.abs(resultado);

                v1 = Math.sqrt(resultado);
                v2 = -v1
                if (a < c) {
                    board.create('point',[v1,0],{name:'A1',size:0.1});
                    board.create('point',[v2,0],{name:'A2',size:0.1});
                }
                else {
                    board.create('point',[0,v1],{name:'A1',size:0.1});
                    board.create('point',[0,v2],{name:'A2',size:0.1});
                }   
                
                f1 = Math.sqrt(v1**2 + ((a>0)?(-f/c):(-f/a))**2)
                f2 = -f1
                if (a < c) {
                    board.create('point',[f1,0],{name:'F1',size:0.1});
                    board.create('point',[f2,0],{name:'F2',size:0.1});
                }
                else {
                    board.create('point',[0,f1],{name:'F1',size:0.1});
                    board.create('point',[0,f2],{name:'F2',size:0.1});
                }
            }
            // Parabola
            else if (type == 8) {
                if (!a) {
                    if (c>0) p = -d/(4*c);
                    else p = d/(4*c);
                    board.create('point',[p,0],{name:'F',size:0.1});
                }
                if (!c) {
                    if (a>0) p = -e/(4*a);
                    else p = e/(4*a);
                    board.create('point',[0,p],{name:'F',size:0.1});
                }
               document.getElementById("Elements").innerText = string
            }
            break;
    }
}
var board = JXG.JSXGraph.initBoard('jgxbox1', {boundingbox: [-20, 10, 20, -10], axis:true});
    
    // Pensei em fazer dois gráficos um pra plotar o gráfico inicial e outro pra plotar os
    // os roles pós translação etc e tals

/*
43
123
13
23
4324
2
-------
4
0
-9
0
0
-36
------
4
-4
7
12
6
-9
*/
