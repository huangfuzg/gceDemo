function play(num,num_length){
  var threshold=10
  var html=''
  var arr=String(num).split('')
  var len=num_length||arr.length
  for (var i=0; i<len; i++){
    if(arr[i]=='.'){
      html+="."
      continue
    }
    html+='<div id="num_'+ i +'" class="num" data-id="'+i+'">';
    html+=retuen10(threshold)
    html+='</div>'
  }
  document.querySelector("#num").innerHTML=html
  var num =document.querySelectorAll(".num");
  var spanHeight=num[0].querySelector('span').offsetHeight;
  var numlen=num_length||num.length;
  for (var j=0;j<numlen;j++){
      var newi=document.createElement('i')
      newi.innerHTML=arr[num[j].getAttribute("data-id")];
      num[j].querySelector("span").appendChild(newi)
    num[j].querySelector("span").style.webkitTransition='all '+(.9+j*.1)+'s ease-in .1s'
    num[j].querySelector("span").style.webkitTransform='translate3d(0,-'+ spanHeight +'px,0)'
    
  }
}

function retuen10(num){
  var html=''
  html+="<span>"
  for(var i=0;i<num;i++){
      for(var j=0;j<10;j++){
        html+='<i>'+ j +'</i>'
      }
  }
  html+="</span>"
  return html
}