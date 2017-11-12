/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.CortarBoi} tx Transacao representacao o corte de um boi
 * @transaction
 */
function cortarBoi(tx) {

    // Save the old value of the asset.
    var pesoItem = tx.boi.pesoAtual;
  	var novoPesoItem = pesoItem - tx.pesoCorte;
  
    var frigorificoBoiIndex = tx.frigorifico.bois.findIndex(function(obj){ 
      return obj.id === tx.boi.id 
    });
  
 	if(frigorificoBoiIndex == -1){
     	throw Error('Este boi não está no frigorifico especificado'); 
    }
 
  	if(novoPesoItem < 0)
    {
     	throw  Error('O peso da peça cortada é maior do que o disponível para o Boi');
    }
  
  	tx.boi.pesoAtual = novoPesoItem;
  

    // Get the asset registry for the asset.
    return getAssetRegistry('com.bullchain.model.Boi')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.boi);

        })
      .then(function(){
      
      	var peca = getFactory().newResource('com.bullchain.model','Peca', tx.tagId);
      	peca.boi = tx.boi;
      	peca.tipo = tx.peca;
        peca.cortavelOrigem = tx.boi;
      	peca.pesoOriginal = tx.pesoCorte;
        peca.pesoAtual = tx.pesoCorte;
      	peca.registro = new Date();
        peca.historia = [];
      
      	var acontecimento = "Peça de carne do tipo " + peca.tipo + " foi cortada do boi (" + tx.boi.id 
        + ") com um peso restante de " + tx.boi.pesoAtual + " Kg às "+
            peca.registro.toLocaleString('pt-BR');
      
      	adicionarAcontecimentoHistoria(peca,acontecimento);

        if(!tx.frigorifico.pecas){
          tx.frigorifico.pecas = [];
        }
      
      	tx.frigorifico.pecas.push(peca);
      	return salvarFrigorifico(tx.frigorifico).
        then(function(){
           return getAssetRegistry('com.bullchain.model.Peca').
        	then(function(assetRegistry){
          		return assetRegistry.add(peca);
        	});
        });               
    });
}
            
function salvarFrigorifico(frigorifico){
	return getParticipantRegistry('com.bullchain.model.Frigorifico')
      .then(function(assetRegistry) {
            return assetRegistry.update(frigorifico); 
   		 });
}

/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.CortarPeca} tx Transacao representacao o corte de um boi
 * @transaction
 */
function cortarPeca(tx) {

    // Save the old value of the asset.
    var pesoItem = tx.peca.pesoAtual;
  	var novoPesoItem = pesoItem - tx.pesoRetirado;
  
  	var frigorificoPecaIndex = tx.frigorifico.pecas.findIndex(function(obj){ 
      return obj.id === tx.peca.id 
    });
  
 	if(frigorificoBoiIndex == -1){
     	throw Error('Esta peça não está no frigorifico especificado'); 
    }
 
  	if(novoPesoItem <= 0)
    {
     	throw  Error('O peso da peça cortada é maior ou igual a peça original');
    }
  
  	tx.peca.pesoAtual = novoPesoItem;
  

    // Get the asset registry for the asset.
    return getAssetRegistry('com.bullchain.model.Peca')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.peca);

        })
      .then(function(){
      
      	var peca = getFactory().newResource('com.bullchain.model','Peca', tx.tagId);
      	peca.tipo = tx.tipoPeca;
      	peca.boi = tx.peca.boi;
        peca.cortavelOrigem = tx.peca;
      	peca.pesoOriginal = tx.pesoRetirado;
        peca.pesoAtual = tx.pesoRetirado;
      	peca.registro = new Date();
      
      	var acontecimento = "Peça de carne do tipo " + peca.tipo + " foi cortada de uma peça de origem identificada por (" + tx.peca.id + ") com um peso restante de " + tx.peca.pesoAtual + " Kg às "+
            peca.registro.toLocaleString('pt-BR');
      
      	adicionarAcontecimentoHistoria(peca,acontecimento);
        
      
        return getAssetRegistry('com.bullchain.model.Peca').
        	then(function(assetRegistry){
          		return assetRegistry.add(peca);
        	});
        
    });
}




/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.transfereBoi} tx The sample transaction instance.
 * @transaction
 */
function transfereBoi(tx) {
    var fazenda = tx.fazenda;
    var fazendaBois = fazenda.bois;
    var frigorifico = tx.frigorifico;
    var boi = tx.boi;
  
  	var acontecimento = "Boi identificado por " + boi.id + " foi transferido da fazenda " 
    	+ fazenda.nome + " para o Frigorífico " + frigorifico.nome + " na data " +
            (new Date()).toLocaleString('pt-BR');
      
    adicionarAcontecimentoHistoria(boi,acontecimento);
    
    var fazendaBoiIndex = fazendaBois.findIndex(function (obj) { return obj.id === boi.id; });
    if(fazendaBoiIndex == -1) {
        throw new Error('Boi nao encontrado na fazenda');
    };
  
    fazendaBois.splice(fazendaBoiIndex, 1);

    if(!frigorifico.bois){
      frigorifico.bois = [];
    }
    
    frigorifico.bois.push(boi);
  
    return getParticipantRegistry('com.bullchain.model.Fazenda').
        then(function(assetRegistry) {
            return assetRegistry.update(fazenda);
        })
      .then(function() {
            return getParticipantRegistry('com.bullchain.model.Frigorifico');
        }).then(function(assetRegistry) {
            return assetRegistry.update(frigorifico);
    }).then(function(){
      	 return getAssetRegistry('com.bullchain.model.Boi')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.boi);

        });
    });

}
/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.transferePeca} tx The sample transaction instance.
 * @transaction
 */
function transferePeca(tx) {
    var frigorificoPecaIndex = tx.frigorifico.pecas.findIndex(function(obj){ 
      return obj.id === tx.peca.id 
    });
    
    if(frigorificoPecaIndex == -1) {
        throw new Error('Peca nao encontrada no frigorifico');
    }
    tx.frigorifico.pecas.splice(frigorificoPecaIndex, 1);

    if(!tx.mercado.pecas){
      tx.mercado.pecas = [];
    }
    
    tx.mercado.pecas.push(tx.peca);
  
  	var acontecimento = "A peça de carne identificada por (" + tx.peca.id + ") foi transferida do frigorífico " +  tx.frigorifico.nome + " para o Mercado " + tx.mercado.nome + " na data " + 
        (new Date()).toLocaleString('pt-BR');;
  	adicionarAcontecimentoHistoria(tx.peca,acontecimento);
  
    return getParticipantRegistry('com.bullchain.model.Frigorifico').
        then(function(participantRegistry) {
            return participantRegistry.update(tx.frigorifico);
        }).
        then(function() {
            return getParticipantRegistry('com.bullchain.model.Mercado');
        }).then(function(participantRegistry) {
            return participantRegistry.update(tx.mercado);
        }).then(function(){
      	 return getAssetRegistry('com.bullchain.model.Peca')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.peca);
        });
    });
  
  ;
}

function adicionarAcontecimentoHistoria(cortavel,acontecimento){
  cortavel.historia.push(acontecimento);
}

/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.registrarBoi} tx The sample transaction instance.
 * @transaction
 */
function registrarBoi(tx) {
  var boi = getFactory().newResource('com.bullchain.model','Boi', tx.boiId);
  boi.fazendaCriacao = tx.fazenda;
  boi.raca = tx.racaBoi;
  boi.registro = new Date();
  boi.historia = [];
  
  var acontecimento = "Boi (" + tx.boiId + ") foi registrado no blockchain no dia " + 
      boi.registro.toLocaleString('pt-BR') + " na Fazenda " + tx.fazenda.nome + ". \n" + tx.fazenda.descricao;
  
  adicionarAcontecimentoHistoria(boi, acontecimento);
    
  if(!tx.fazenda.bois){
    tx.fazenda.bois = [];
  }
  
  tx.fazenda.bois.push(boi);
  
  return getAssetRegistry('com.bullchain.model.Boi')
  	.then(function(assetRegistry){
    	return assetRegistry.add(boi);
  	})
    .then(function(){
    	return getParticipantRegistry('com.bullchain.model.Fazenda')
    		.then(function(participantRegistry){
          		return participantRegistry.update(tx.fazenda);
        	});
  	});
}

/**
 * Sample transaction processor function.
 * @param {com.bullchain.model.atualizarPesoBoi} tx The sample transaction instance.
 * @transaction
 */
function atualizarPesoBoi(tx) {
  var acontecimento = "O peso do boi ao chegar no frigorífico é de: " + tx.peso + " Kg";
  adicionarAcontecimentoHistoria(tx.boi,acontecimento);
  
  tx.boi.pesoOriginal = tx.peso;
  tx.boi.pesoAtual = tx.peso;
  
  return getAssetRegistry('com.bullchain.model.Boi')
  	.then(function(assetRegistry){
    	return assetRegistry.update(tx.boi);
  	});
}