/*
CONIC DETERMINATION
Alunos: Odonto, Pato, Dio, Bio, Árabe
USP -- ICMC -Instituto de Ciências Matemáticas e da Computação 

Programa utilizado para simplificar uma equação de uma cônica dada na forma:
AX² + BXY + CY² + DX + EY + F = 0

--> Realiza A translação do sistema de coordenadas para eliminar os termos lineares (DX e EY) caso existam, apresentando
    qual será o nova origem desse sistema (H,K) no sistema antigo.
    
    --> Realiza a rotação do sistema de coordenadas para eliminar o termos quadrático misto (BXY) caso exista, apresentando
    qual o angulo entre 0° e 90° é utilizado para a rotação que resulta na eliminação do termo.
    
    --> Apresenta o gráfico da cônica obtida

Referências utilizadas para realizar as considerações matemáticas neste programa:
    http://www.onemathematicalcat.org/Math/Precalculus_obj/conicDiscriminant.htm
    https://people.richland.edu/james/lecture/m116/conics/conics.html
    
*/

// Função que realiza a conversão de um valor float para uma fração para facilitar a visualização
const decToFrac = (value, donly = true) => {
    let tolerance = 1.0E-5; 
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let negative = false;
    let i;

    let string = "";

    // Caso inteiro, finaliza o script
    if (parseInt(value) == value){
        return value.toString();
    }
    else if (value < 0) {
        negative = true;
        value = -value;
        string += "-"
    }
    let square = value*value
    if (Math.abs(Math.round(square) - square) < 0.01) {
        if (!Math.round(square)) return "0"
        string +=`\\sqrt{${Math.round(square)}}`
        return string;
    }

    if (donly) {
        i = parseFloat(value);
        value -= i;
    }
    
    let b = value;

    do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(value - h1 / k1) > value * tolerance);

    let resultadoFracao = (negative ? "-" : '') + ((donly & (i != 0)) ? i + ' ' : '') + (h1 == 0 ? '' : `\\frac{${h1}}{${k1}}`);

    if (typeof(resultadoFracao) === "number") {resultadoFracao = resultadoFracao.toString();}

   return resultadoFracao;
}

/*
    Determina o tipo de conica dado seus coeficientes  A,B,C,D,E,F
            AX² + BXY + CY² + DX + EY + F = 0
    Segue a seguinte enumeração dos tipos:
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
const determination = (a, b, c, d, e, f) => {
    /* 
        Calculando o determinante da matriz simétrica reduzida
        | A   B/2 |  
        | B/2   C |
        Determinante(M) = AC - B²/4   
    */
    let Det = (a*c*f) - (((d**2)*c + (b**2)*f + (e**2)*a - b*e*d))/4
 
    // Utilizando os valores que irão auxiliar na determinação
    let t = a + c
    let coft1 = c*f - ((e/2)**2)
    let coft2 = a*f - ((d/2)**2)
    let coft3 = a*c - ((b/2)**2)

    // Variável correspondente ao tipo
    let type

    // CASO VAZIO
    if (((coft3 > 0) && (t * Det > 0)) || ((coft3 == 0) && (Det == 0) && (coft1 + coft2 > 0))) {
        document.getElementById("Type").innerText = "Empty"
        type = 0
    }
    // CASO DE UM PONTO
    else if ((coft3 > 0) && (Det == 0)) {
        document.getElementById("Type").innerText = "Point"
        type = 1
    }
    // CASO DE UM PAR DE RETAS PARALELAS COINCIDENTES
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 == 0)) {
        document.getElementById("Type").innerText = "Pair of identical lines" 
        type = 2
    }
    // CASO DE UM PAR DE RETAR PARALELAS DISTINTAS
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 < 0) && ((a != 0) || (b != 0) || (c != 0))) {
        document.getElementById("Type").innerText = "Pair parallel lines"
        type = 3
    }
    // CASO DE UM PART DE RETAS CONCORRENTES
    else if ((coft3 < 0) && (Det == 0)) {
        document.getElementById("Type").innerText = "Pair of intersecting lines" 
        type = 4
    }
    // CASO DE UMA RETA ÚNICA
    else if ((coft3 == 0) && (Det == 0) && (coft1 + coft2 < 0) && ((a == 0) && (b == 0) && (c == 0))) {
        document.getElementById("Type").innerText = "Line"
        type = 5
    }
    // CASO DE UMA ELIPSE
    else if ((coft3 > 0) && (t * Det < 0) && (a != c)) {
        document.getElementById("Type").innerText = "Ellipse" 
        type = 6
    }
    // CASO DE UMA HIPERBOLE
    else if ((coft3 < 0) && (Det != 0)) {
        document.getElementById("Type").innerText = "Hyperbola" 
        type = 7
    }
    // CASO DE UMA PARÁBOLA
    else if ((coft3 == 0) && (Det != 0)) {
        document.getElementById("Type").innerText = "Parabola" 
        type = 8
    }    
    // CASO ESPECIAL DE ELÍPSE --> CIRCUNFERÊNCIA
    else if ((coft3 > 0) && (t * Det < 0) && (a == c)) {
        document.getElementById("Type").innerText = "Circumference (Ellipse)" 
        type = 9
    }    

    // Retornado o tipo de acordo com a tabela mostrada no comentario inicial.
    return type
}

/*
    Função que realiaza o cálculo dos elementos do gráfico:
    ELIPSE         --> FOCOS, VERTICES, EXCENTRICIDADE
    HIPERBOLE      --> FOCOS, VERTICES, EXCENTRICIDADE
    PARABOLA       --> FOCO, PARÂMTRO P
    CIRCUNFERÊNCIA --> RAIO 
*/
const findElements = (type, a, b, c, d, e, f) => {
    // Sabemos que os pontos do vertice, foco e centro serão sempre posicionados
    // em um eixo, ou seja (X,0) ou (0,Y), devido os processos de rotação e translação.

    let f1, f2       // Variáveis correspondentes aos focos F1 e F2
    let exc          // Variável correspondente à excentricidade
    let v1, v2       // Variáveis correspondentes aos vértices do maior eixo (considerando caso da elipse)
    let b1,b2        // Variáveis correspondentes aos vértices do menor eixo (considernaod caso da elipse)
    let string = ""  // Cadeia de caracteres que irá ser retornada para o HTML
    let p            // Variável do parâmetro da parábola
    let center       // Variável correspondente ao centro
    let radiun       // Valor do raio da circunferência
        
    document.getElementById("ElTitle").innerText = "Elements"  
    // Ellipse
    if (type == 6) {
        /* Devemos encontrar qual o maior eixo da elipse, identificado qual valor da equação do tipo
            X²/ a² + Y²/ b² = 1  ==> A elipse possui seu maior eixo no eixo X
                ou
            X²/ b² + Y²/ a² = 1 ==> A elipse possui seu maior eixo no eixo Y
         
            Lembrando que   
                    a --> valor do semi-eixo maior (distância do centro da elipse até um de seus vértices A)
                    b --> valor do semi-eixo menor (distância do centro da elipse até um de seus vértices B)
            Sabemos ainda pelo teorema de pitágoras:
                    a² = b² + c²
                    c --> valor da distância focal (distancia do centro da elipse até um de seus focos F)
            Por fim, a excentricidade corresponde ao valor da divisão 
                    e = c/a
        */ 
        v1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/a) : (-f/c)) 
        v2 = -v1
        if (a < c) string += `First Vertice (A1): (<span id="v1"></span>,0) <br>Second Vertice (A2): (<span id="v2"></span>, 0)`
        else string += `First Vertice (A1): (0,<span id="v1"></span>) Second Vertice (A2): (0,<span id="v2"></span>)`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"

        b1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/c) : (-f/a))
        b2 = -b1
        if (a < c) string += `Third Vertice  (B1): (0, <span id="b1"></span>) . <br>Fourth Vertice (B2): (0, <span id="b2"></span>)`
        else string += `Third Vertice (B1): (<span id="b1"></span>, 0) . Fourth Vertice (B2): (<span id="b2"></span>, 0)`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"

        f1 = Math.sqrt((v1**2) - (b1**2))
        f2 = -f1
        if (a < c) string += `First Focus (F1): (<span id="f1"></span>, 0) . <br>Second Focus (F2): (<span id="f2"></span>, 0)`
        else string += `First Focus (F1): (0,<span id="f1"></span>) . <br>Second Focus (F2): (0, <span id="f2"></span>)`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        string += `Excentricite : <span id="excentricite"></span>`
        exc = f1/v1;
        exc = decToFrac(exc, false);
        
        // Renderizando resultado
        document.getElementById("Elements").innerHTML = string;
        katex.render((decToFrac(v1, false)), document.getElementById("v1"), {
            trowOnError: false
        })
        katex.render((decToFrac(v2, false)), document.getElementById("v2"), {
            trowOnError: false
        })
        katex.render((decToFrac(b1, false)), document.getElementById("b1"), {
            trowOnError: false
        })
        katex.render((decToFrac(b2, false)), document.getElementById("b2"), {
            trowOnError: false
        })
        katex.render((decToFrac(f1, false)), document.getElementById("f1"), {
            trowOnError: false
        })
        katex.render((decToFrac(f2, false)), document.getElementById("f2"), {
            trowOnError: false
        })
        katex.render(exc, document.getElementById("excentricite"), {
            trowOnError: false
        })
    }
    // Hyperbola
    else if (type == 7) {
         /* Devemos encontrar em qual eixo X e Y se encontra o eixo (que contêm os focos e vértices da hiperbole)
            identificado qual valor da equação do tipo:

            X²/ a² - Y²/ b² = 1  ==> Hipérbole possui seu eixo no eixo X
                ou
            X²/ b² - Y²/ a² = 1 ==> Hipérbole possui seu eixo no eixo Y
         
            Lembrando   a --> Distância do vértice da hiperbole até o centro (origem do sistema)
            Sabemos pelo teorema de Pitágoras para hiperboles:
                        c² = a² + b²  
                        c --> Distancia do centro do sistema até um dos focos da hiperbole 
            A excentricidade da hiperbole também é dada pela divisão 
                        e = c/a
        */ 
        let resultado = (-f/a > 0) ? (-f/a):(f/c);
        resultado = Math.abs(resultado);

        v1 = Math.sqrt(resultado);
        v2 = -v1   
        if (a > 0) string += `First Vertice (A1): (<span id="v1"></span>,0) <br>Second Vertice (A2): (<span id="v2"></span>,0)`
        else string += `First Vertice (A1): (0,<span id="v1"></span>) <br>Second Vertice (A2): (0,<span id="v2"></span>)`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        
        f1 = Math.sqrt(v1**2 + ((a>0)?(-f/c):(-f/a))**2)
        f2 = -f1
        if (a > 0) string += `First Focus (F1): (<span id="f1"></span>,0) <br>Second Focus (F2): (<span id="f2"></span>,0)`
        else string += `First Focus (F1): (0<span id="f1"></span> <br>Second Focus (F2): (0,<span id="f2"></span>)`
        string += "<br>---------------------------------------------------------------------------------------------------<br>"
        string += `Excentricite : <span id="excentricite"></span>`
        exc = f1/v1;
        exc = decToFrac(exc, false);

        // Renderizando Resultado
        document.getElementById("Elements").innerHTML = string;
        katex.render((decToFrac(v1, false)), document.getElementById("v1"), {
            trowOnError: false
        })
        katex.render((decToFrac(v2, false)), document.getElementById("v2"), {
            trowOnError: false
        })
        katex.render((decToFrac(f1, false)), document.getElementById("f1"), {
            trowOnError: false
        })
        katex.render((decToFrac(f2, false)), document.getElementById("f2"), {
            trowOnError: false
        })
        katex.render((exc), document.getElementById("excentricite"), {
            trowOnError: false
        })
    }
    // Parabola
    else if (type == 8) {
        /*
            Para a parábola existem duas opções:
            Y² = 4PX --> o eixo da parábola esta no eixo X
             ou
            X² = 4PY --> o eixo da parábola esta no eixo Y

            O valor de P corresponde ao parâmetro da parâbola
            O foco da parábola possui equação (P,0) caso seja do tipo Y² = 4PX
                                             (-P,0) caso seja do tipo X² = 4PY

            OBS: Caso não conseguimos realizar a operação de translação, o foco estará mal posicionado ...                                 
        */
        if (!a) {
            if (c>0) p = -d/(4*c);
            else p = d/(4*c);
            string = `P = <span id="p"></span>, and the focus is at F (<span id="p2"></span>,0)`             
        }
        if (!c) {
            if (a>0) p = -e/(4*a);
            else p = e/(4*a);
            string += `P = <span id="p"></span>, and the focus is at F (0,<span id="p2"></span>)` 
        }

        // Renderizando Resultado
        document.getElementById("Elements").innerHTML = string
        katex.render((decToFrac(p, false)), document.getElementById("p"), {
            trowOnError: false
        })
        katex.render((decToFrac(p, false)), document.getElementById("p2"), {
            trowOnError: false
        })
    }
    // Circumference
    else if (type == 9){
        /* 
            A equação da circunferência é do tipo
                (X-a)² + (Y-b)² = R²
            Teremos os elementos:
                Centro possui coordenadas (a,b)
                Raio = R
            
            OBS: Como fizemos a translaçõo e rotação, o centro é a própria origem do sistema
        */
        if (a < 0) radius = Math.sqrt(f)
        else radius = Math.sqrt(-f)
        if (typeof(radius) == "number") radius = radius.toString();
        string = `The radius of the circumference is <span id="radius"></span>`

        // Renderizando Resultado
        document.getElementById("Elements").innerHTML = string
        katex.render((decToFrac(radius, false)), document.getElementById("radius"), {
            trowOnError: false
        })
    }
}

/*
    Função que realiza o procesos de manipular a string para que seja dado uma equação resultante adequada
    Recebe o valor do coeficiente, a cadeia de caracteres que irá adicionar e qual string será manipulada
*/
const auxPrintEquation = (coef, add, string) => {
    let temp = "" // Valor correspondente ao valor do coeficiente temporário interno a função
    /*
        Caso o coeficiente do termo seja positivo, iremos adicionar o símbolo '+' (exceto na primeira ocorrência),
        ou seja, a string já deve estar preenchida e não nula.
        Acrescenta apenas o elemento (X² por exemplo) caso o coeficiente seja 1 (para não acrescentar 1X², sendo desnecessário)
    */
    if (coef > 0) {
        temp = decToFrac(coef, false)
        if (temp != "0") {    
            if (string) string += "+ "
            if (temp != 1) string += `${temp}`
            else
                if (add == " ") string += `${temp}`    
            string += `${add}`    
        }
    }
    /*
        Para casos negativos, teremos sempre o acrescimo do símbolo '-'
        Caso o valor do coeficiente seja -1, teremos o acrescimo apenas do simbolo negativo.
    */
    else if (coef < 0) {
        if (temp != "0") {
            temp = decToFrac(-coef, false)
            string += "- "
            if (temp != 1) string += `${temp}`
            else 
                if (add == " ") string += `${temp}`    
            string += `${add}`    
        }
    }
    return string
}

/* Função requisitada para retornar uma string completa, em um formato 
            AX² + BXY + CY² + DX + EY + F = 0
    sendo o sistema de coordenadas (X,Y) alterado para outros sistemas, por exemplo (U,V), caso sejam realizadas translações
    e/ou rotações
*/
const printEquation = (a, b, c, d, e, f, x, y) => {
    let string = ""

    string = auxPrintEquation(a, `${x}^2 `, string)
    string = auxPrintEquation(b, `${x}${y}`, string)
    string = auxPrintEquation(c, `${y}^2 `, string)
    string = auxPrintEquation(d, `${x} `, string)
    string = auxPrintEquation(e, `${y} `, string)
    string = auxPrintEquation(f, " ", string)

    if (string) string += " = 0 "
    else string = false;
    
    return string
}

/*
    Função que simplifica os coefientes da equação pelo máximo divisor comum
*/
const simplifyEquation = (a,b,c,d,e,f) => {
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

const graph = () => {
    // Mostrando todos os resultados, e zerando anteriores
    hiddenElements = document.getElementsByClassName("hidden");
    hiddenElements[0].style.display = "block"
    hiddenElements[1].style.display = "block"
    
    document.getElementById("Elements").innerHTML = "";
    document.getElementById("firstEquation").innerHTML = "";
    document.getElementById("secondEquation").innerHTML = "";
    document.getElementById("ElTitle").innerText = "";  
    
    // Pegando do HTML todos os coeficientes da equação da cônica
    // Caso não seja passado um coeficiente, será atribuido 0 automaticamente à ele 
    let a = parseFloat(document.getElementById("coefA").value) || 0
    let b = parseFloat(document.getElementById("coefB").value) || 0
    let c = parseFloat(document.getElementById("coefC").value) || 0
    let d = parseFloat(document.getElementById("coefD").value) || 0
    let e = parseFloat(document.getElementById("coefE").value) || 0
    let f = parseFloat(document.getElementById("coefF").value) || 0
    
    // Utilizando a função para retornar qual o tipo da cônica formada partir dos coeficientes submetidos
    let type = determination(a,b,c,d,e,f)
    plotgraph(a,b,c,d,e,f, type, 0, false)
    
    //  Fazendo a primeira impressão da equação formada utilizando os coeficientes obtidos
    let equation = printEquation(a,b,c,d,e,f,"x","y")

    if (!equation) {
        document.getElementById("equation").innerText = "Not an equation"
    } else {
        katex.render(equation, document.getElementById("equation", {
            trowOnError: false
        }))
    }

    let a2 = a
    let b2 = b
    let c2 = c
    let d2 = d
    let e2 = e
    let f2 = f
    let h, k
    
    const det = a*c - (b/2)**2
    
    let flagFirstDet = det
    
    if(b2 != 0) {
        let tanteta1 = (2*a - 2*c + Math.sqrt((2*a - 2*c)**2 + 4*b**2))/(-2*b)
        let teta1 = (Math.atan(tanteta1))*(180/Math.PI)
        if (teta1 < 0) teta1 += 90 

        a2 = (a + c + b*Math.sqrt(1+((a-c)/b)**2))/2 
        b2 = 0
        c2 = a + c - a2

        let cos1 = Math.sqrt(1/(tanteta1**2 + 1))
        let sin1 = Math.sqrt(1 - (cos1)**2)
           
        if (flagFirstDet == 0) {
            d2 = d*cos1 + e*sin1
            e2 = (-d)*sin1 + e*cos1
        }

        let coefs = simplifyEquation(a2,b2,c2,d2,e2,f2)
        a2 = coefs[0]
        b2 = coefs[1]
        c2 = coefs[2]
        d2 = coefs[3]
        e2 = coefs[4]
        f2 = coefs[5]

        let neweq2 = printEquation(a2,b2,c2,d2,e2,f2,"t","w")    
        if (typeof(neweq2) === "number") {neweq2 = neweq2.toString();}
        katex.render(neweq2, document.getElementById("firstEquation", {
            trowOnError: false
        }))

        document.getElementById("answerTetas").innerText =  `We have for rotation: First angle ${teta1.toFixed(2)} °`
    }
    else document.getElementById("answerTetas").innerText = "Rotation unnecessary"
    
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

            let coefs = simplifyEquation(a2,b2,c2,d2,e2,f2)
            a2 = coefs[0]
            b2 = coefs[1]
            c2 = coefs[2]
            d2 = coefs[3]
            e2 = coefs[4]
            f2 = coefs[5]

            let neweq = printEquation(a2,b2,c2,d2,e2,f2,"u","v")
            if (typeof(neweq) === "number") {neweq = neweq.toString();}
            katex.render(neweq, document.getElementById("secondEquation", {
                trowOnError: false
            }))
        }
    }
    else document.getElementById("answerHK").innerText = "Translation unnecessary"
    
    if (type > 5) findElements(type, a2,b2,c2,d2,e2,f2)

    plotgraph(a2, b2, c2, d2, e2, f2, type, 1, true);

}

/*
    Função que verifica se a equação fornecida pode ser considerada a diferença entre dois quadrado:
                X² - Y² = 0
    podemos realizar a manipulação algébrica para chegar em
            (X + Y)(X - Y) = 0
    o que corresponderia, neste caso específico, a duas retas concorrentes r1: X = -Y  e r2: X = Y
*/
const isDiffSquares = (a, b, c, d, e, f, type) => {
    if (!b && !d && !e) {
        if (a * c < 0) return 1
        else return 0
    }
    else return 0
}

/*
    Função utilizada para conferir se a equação obtida pode ser representada por um quadrado perfeito:
            X² + 2XY + Y² = 0
    fazendo manipualções algébricas, encontraríamos
               (X + Y)² = 0
    o que corresponderia, neste caso específico, a duas retas paralelas idênticas r1 = r : X = -Y
*/
const isPerfctSquare = (a, b, c, d, e, f, type) => {
    if (!d && !e && (f <= 0)) {
        if ((a > 0) && (c > 0)) {
            if (b < 0) {
                if (b = -2 * Math.sqrt(a * c)) return 1
                else return 0
            }
            else if (b > 0) {
                if (b = 2 * Math.sqrt(a * c)) return 1
                else return 0
            }
            else return 0
        }
        else return 0
    }
    else return 0
}

/*  
    Função que confere se a equação representa um caso base uma linha do tipo X = K ou Y = K, sendo K o valor de 
    uma constante
*/
const isBaseCase = (a, b, c, d, e, f, type) => {
    if (!a && !b && !c && d && !e) return 1 //Caso x = k = -f/d
    if (a && !b && !c && !d && !e) return 2 //Caso x² = 0
    if (!a && !b && !c && !d && e) return 3 //Caso y = k = -f/e
    if (!a && !b && c && !d && !e) return 4 //Caso y² = 0
}

const plotgraph = (a, b, c, d, e, f, type, boardNumber, printPoints) => {
    let board = boards[boardNumber];
    if (!boardNumber) {
        board.create('arrow',[[0,0],[0,1]],{strokeWidth:2,strokeColor:'purple'});
        board.create('text',[0.1,0.4,'x']);
        board.create('arrow',[[0,0],[1,0]],{strokeWidth:2, strokeColor:'orange'});
        board.create('text',[0.4,0.1,'y']);
    } 
    else {
        board.create('arrow',[[0,0],[0,1]],{strokeWidth:2,strokeColor:'purple'});
        board.create('text',[0.1,0.4,'t']);
        board.create('arrow',[[0,0],[1,0]],{strokeWidth:2, strokeColor:'orange'});
        board.create('text',[0.4,0.1,'w']);
    }

    switch (type) {
        case 0: // Conjunto vázio
            break;

        case 1: // Ponto
            board.create('point', [0,0], {fixed:true})
            break;

        case 2: // Par de retas paralelas idênticas
            let isBase2 = isBaseCase(a, b, c, d, e, f)
            let isPerfSqr2 = isPerfctSquare(a, b, c, d, e, f)
            if (isBase2) {
                if (isBase2 == 1) { // x = -f/d
                    board.create('line',[[-(f/d),0],[-(f/d),1]]);
                }
                else if (isBase2 == 2) { //x² = 0
                    board.create('line',[[0,0],[0,1]]);
                }
                else if (isBase2 == 3) { // y = -f/e
                    board.create('line',[[0,-(f/e)],[1,-(f/e)]]);
                }
                else { //y² = 0
                    board.create('line',[[0,0],[1,0]]);
                }
            }
            else if (isPerfSqr2) {
                if (b > 0) { //(ax + cy)² = -f
                    y0NegativeSqrt = -((Math.sqrt(-f))/c)
                    y0PositiveSqrt = ((Math.sqrt(-f))/c)
                    y1NegativeSqrt = -(a + (Math.sqrt(-f)))/c
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
            break;

        case 3: // Caso de retas paralelas distintas
            let isBase3 = isBaseCase(a, b, c, d, e, f)
            let isPerfSqr3 = isPerfctSquare(a, b, c, d, e, f)
            if (isBase3) {
                if (isBase3 == 2) { //x² = -f/a
                    yNegativeSqrt = -(Math.sqrt(-f)/a)
                    yPositiveSqrt = (Math.sqrt(-f)/a)
                
                    board.create('line',[[0,yNegativeSqrt],[1,yNegativeSqrt]]);
                    board.create('line',[[0,yPositiveSqrt],[1,yPositiveSqrt]]); 
                }
                else { //y² = -f/c
                    xNegativeSqrt = -(Math.sqrt(-f)/c)
                    xPositiveSqrt = (Math.sqrt(-f)/c)
                
                    board.create('line',[[0,xNegativeSqrt],[1,xNegativeSqrt]]);
                    board.create('line',[[0,xPositiveSqrt],[1,xPositiveSqrt]]); 
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
            break;

        case 4: // Par de retas concorrentes
            let isDiffSqrt = isDiffSquares(a,b,c,d,e,f)
            if (isDiffSqrt) { // ax² - cy² = (√(a)x + √(c)y) * (√(a)x + √(c)y) = 0
                y1SumCase = -Math.sqrt(Math.abs(a/c))
                y1SubCase = Math.sqrt(Math.abs(a/c))

                board.create('line',[[0,0],[1,y1SumCase]]);
                board.create('line',[[0,0],[1,y1SubCase]]); 
            }
            break;

        case 5: // Reta única
            let y0 = f
            let y1 = a + b + c + d + e + f
            board.create('line',[[0,y0],[1,y1]]);
            break;

        // Como os demais gráficos são do tipo cônico na bilbioteca jsxgraph, podemos utilizar caso default
        // e separar entre outros casos internamente para encontrar seus elementos
        default:
            board.create('conic', [a, c, f, b/2, d/2, e/2]);
            if (printPoints) {
                // Elípse
                if (type == 6) {
                    v1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/a) : (-f/c))
                    v2 = -v1
                    if (a < c) {
                        board.create('point',[v1,0],{name:'A1',size:0.1,fixed:true});
                        board.create('point',[v2,0],{name:'A2',size:0.1,fixed:true});
                    }
                    else {
                        board.create('point',[0,v1],{name:'A1',size:0.1,fixed:true});
                        board.create('point',[0,v2],{name:'A2',size:0.1,fixed:true});
                    }

                    b1 = Math.sqrt(((-f/a) > (-f/c)) ? (-f/c) : (-f/a))
                    b2 = -b1
                    if (a < c) {
                        board.create('point',[0,b1],{name:'B1',size:0.1,fixed:true});
                        board.create('point',[0,b2],{name:'B2',size:0.1,fixed:true});
                    }
                    else {
                        board.create('point',[b1,0],{name:'B1',size:0.1,fixed:true});
                        board.create('point',[b2,0],{name:'B2',size:0.1,fixed:true});
                    }

                    f1 = Math.sqrt((v1**2) - (b1**2))
                    f2 = -f1
                    if (a < c) {
                        board.create('point',[f1,0],{name:'F1',size:0.1,fixed:true});
                        board.create('point',[f2,0],{name:'F2',size:0.1,fixed:true});
                    }
                    else {
                        board.create('point',[0,f1],{name:'F1',size:0.1,fixed:true});
                        board.create('point',[0,f2],{name:'F2',size:0.1,fixed:true});
                    }
                }
                // Hipérbole
                else if (type == 7) {
                    let resultado = (-f/a > 0) ? (-f/a):(f/c);
                    resultado = Math.abs(resultado);
                    console.log(resultado);
                    v1 = Math.sqrt(resultado);
                    v2 = -v1
                    if (a < c) {
                        board.create('point',[v1,0],{name:'A1',size:0.1,fixed:true});
                        board.create('point',[v2,0],{name:'A2',size:0.1,fixed:true});
                    }
                    else {
                        board.create('point',[0,v1],{name:'A1',size:0.1,fixed:true});
                        board.create('point',[0,v2],{name:'A2',size:0.1,fixed:true});
                    }   
                    
                    f1 = Math.sqrt(v1**2 + ((a>0)?(-f/c):(-f/a))**2)
                    f2 = -f1
                    if (a < c) {
                        board.create('point',[f1,0],{name:'F1',size:0.1,fixed:true});
                        board.create('point',[f2,0],{name:'F2',size:0.1,fixed:true});
                    }
                    else {
                        board.create('point',[0,f1],{name:'F1',size:0.1,fixed:true});
                        board.create('point',[0,f2],{name:'F2',size:0.1,fixed:true});
                    }
                }
                // Parabola
                else if (type == 8) {
                    if (!a) {
                        if (c>0) p = -d/(4*c);
                        else p = d/(4*c);
                        board.create('point',[p,0],{name:'F',size:0.1,fixed:true});
                    }
                    if (!c) {
                        if (a>0) p = -e/(4*a);
                        else p = e/(4*a);
                        board.create('point',[0,p],{name:'F',size:0.1,fixed:true});
                    }
                }
                // Cincunferência
                else if (type == 9) {
                    let y2 = 
                    board.create('point',[0,0],{name:'Center',size:0.1,fixed:true});

                    board.create('segment',[0,0],{name:'Center',size:0.1});
                }
            }    
            break;
    }
}

// Inicializa o programa
var boards = []
const init = () => {
    var board = JXG.JSXGraph.initBoard('jxgbox1', {boundingbox: [-10, 5, 10, -5], axis:true, grid:true});
    var board2 = JXG.JSXGraph.initBoard('jxgbox2', {boundingbox: [-10, 5, 10, -5], axis:true, grid:true});
    boards = [board,board2];
    graph()
} 