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
        if (temp != 1) string += `${temp}`    
        string += `${add}`    
    }
    else if (coef < 0) {
        temp = decToFrac(-coef, false)
        if (temp != 1) string += `- ${temp}`    
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
    let denominador;

    let coefs = [a, b, c, d, e, f]
    coefs = coefs.map( coefieciente => (Math.abs(coefieciente)))
    coefs = coefs.sort((a, b) => a - b);

    let i = 0
    while (!coefs[i]) i++
    let num = coefs[i]
    
    coefs = [a, b, c, d, e, f]

    for (div = 2; num > 1; div++) {
        if (num % div != 0) continue;
        
        while (num % div == 0) {
            num /= div;         
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
}


const createGraph = (a, b, c, d, e, f) => {

    let board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis:true});
}


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