

var g_nodes_num;

function log2(x)
{
	return Math.log(x) / Math.log(2);
}
function h(x)
{
	if (x > 0)
	    {
		return -1 * x * log2(x);
		}
		
	else
		return 0;
}
//H(X)
function H( X)
{
	if(X[0][0] != undefined)
	{
		let res = 0;
		for (let i = 0; i < X.length; ++i)
		{
			res += H(X[i]);
		}
		
	}
	else
	{
		let p1 = X.length / g_nodes_num;
		let p0 = 1 - p1;
		res = h(p0) + h(p1);
		
	}
	return res;
}
function array_remove_repeat(a) { // 去重
    let r = [];
    for(let i = 0; i < a.length; i ++) {
        let flag = true;
        let temp = a[i];
        for(let j = 0; j < r.length; j ++) {
            if(temp === r[j]) {
                flag = false;
                break;
            }
        }
        if(flag) {
            r.push(temp);
        }
    }
    return r;
}

function intersection(a, b) { // 交集
    let result = [];
    for(let i = 0; i < b.length; i ++) {
        let temp = b[i];
        for(let j = 0; j < a.length; j ++) {
            if(temp === a[j]) {
                result.push(temp);
                break;
            }
        }
    }
	//console.log(array_remove_repeat(result));
    return array_remove_repeat(result);
}

function difference(a, b) { // 差集 a - b
    //clone = a
    let clone = a.slice(0);
    for(let i = 0; i < b.length; i ++) {
        let temp = b[i];
        for(let j = 0; j < clone.length; j ++) {
            if(temp === clone[j]) {
                //remove clone[j]
                clone.splice(j,1);
            }
        }
    }
	//console.log(array_remove_repeat(clone));
    return array_remove_repeat(clone);
}
//H(Xi, Yj)
function H_Xi_joint_Yj( Xi,  Yj)
{
	let P11 = intersection(Xi, Yj).length / g_nodes_num;
	let P10 = difference(Xi, Yj).length / g_nodes_num;
	let P01 = difference(Yj, Xi).length / g_nodes_num;
	let P00 = 1 - P11 - P10 - P01;

	if (h(P11) + h(P00) >= h(P01) + h(P10))
		return h(P11) + h(P10) + h(P01) + h(P00);
	else
		return H(Xi) + H(Yj);
}
//H(Xi|Yj)
function H_Xi_given_Yj( Xi, Yj)
{
	return H_Xi_joint_Yj(Xi, Yj) - H(Yj);
}
//H(Xi|Y) return min{H(Xi|Yj)} for all j
function H_Xi_given_Y( Xi,  Y)
{
	let res = H_Xi_given_Yj(Xi, Y[0]);
	for (let i = 1; i < Y.length; ++i)
	{
		
		let d=H_Xi_given_Yj(Xi, Y[i]);
		if (res >d){
			res=d;
		}
		
	}
	return res;
}
//H(Xi|Y)_norm
function H_Xi_given_Y_norm( Xi,  Y)
{    
	return H_Xi_given_Y(Xi, Y) / H(Xi);
}
//H(X|Y)
function H_X_given_Y( X, Y)
{
	let res = 0;
	for (let i = 0; i < X.length; ++i)
	{
		res += H_Xi_given_Y(X[i], Y);
	}

	return res;
}

//H(X|Y)_norm
function H_X_given_Y_norm( X,  Y)
{
	let res = 0;
	for (let i = 0; i < X.length; ++i)
	{
		res += H_Xi_given_Y_norm(X[i], Y);
	}
	return res / X.length;
}



//返回X和Y中不重复元素个数
function getNodesNum( X,  Y)
{
	let s=[];
	for (let i = 0; i < X.length; ++i)
	{
		for (let j = 0; j < X[i].length; ++j)
			s.push(X[i][j]);
	}
	for (let i = 0; i < Y.length; ++i)
	{
		for (let j = 0; j < Y[i].length; ++j)
			s.push(Y[i][j]);
	}
	return array_remove_repeat(s).length;
}

function NMI( X,  Y)
{
	if (X.length == 0 || Y.length == 0)
		return 0;
	g_nodes_num = getNodesNum(X, Y);
	return 1 - 0.5 * (H_X_given_Y_norm(X, Y) + H_X_given_Y_norm(Y, X));
}

//I(X:Y)
function I( X,  Y)
{
	return 0.5 * (H(X) + H(Y) - H_X_given_Y(X, Y) - H_X_given_Y(Y, X));
}
function NMI_max( X, Y)
{
	let k=H(X);
	if(k<H(Y)){
		k=H(Y)
	}
	return I(X,Y) / (k);
}

function main()
{
	let X = [ [3, 4, 5, 6, 7], [1, 2, 3, 4],[6, 7, 8, 10]];
	let Y = [[1, 2, 3, 4 ], [5, 6, 7, 8, 10], [7, 8, 10]];

	console.log("NodesNum= ",getNodesNum(X, Y));
	console.log("lfk_NMI = ",NMI(X,Y)) ;  
	//console.log("lfk_NMI = ",NMI(Y,X)); 
	//console.log("max_NMI = ",NMI_max(X,Y)) ;
	//console.log("max_NMI = " ,NMI_max(Y,X));

}