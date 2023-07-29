/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const languageStrings = require('./language')

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

var persistenceAdapter = getPersistenceAdapter();


function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'user_mail_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}



const DOCUMENT_ID = "Bienvenido";

const datasource = {
    "headlineTemplateData": {
        "type": "object",
        "objectId": "headlineSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://static.vecteezy.com/system/resources/previews/008/656/359/non_2x/travel-concept-plane-realistic-airliner-on-background-of-continents-and-continents-of-globe-travel-and-international-flights-tourism-color-vector.jpg",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Bienvenido"
                }
            },
            "logoUrl": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png",
            "hintText": "Intenta decir, \"Alexa, muestra vuelos a cancún\""
        }
    }
};

const DOCUMENT_ID1 = "ErrorDocument";

const datasource1 = {
    "headlineData": {
        "headerTitle": "Viajes blue",
        "primaryText": "ERROR",
        "secondaryText": "No he logrado entenderte",
        "footerHintText": "Intenta decir, \"Alexa, muestra viajes a cancún\"",
        "headerAttributionImage": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png"
    }
};

const DOCUMENT_ID2 = "Oferta";

const datasource2 = {
    "imageListData": {
        "type": "object",
        "objectId": "paginatedListSample",
        "title": "Viajes Blue",
        "listItems": [
            {
                "primaryText": "Viajes a Cancún",
                "secondaryText": "Boletos al 2X1",
                "imageSource": "https://media.staticontent.com/media/pictures/895fa3cb-d8db-41f4-bb01-c41e71f34e67"
            },
            {
                "primaryText": "Código de descuento 'JL15'",
                "secondaryText": "Valido para el mes de julio, en compras mayores a $1000",
                "imageSource": "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OHx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80"
            },
            {
                "primaryText": "Vuelo redondo",
                "secondaryText": "5% de descuento en adelante",
                "imageSource": "https://static.hosteltur.com/app/public/uploads/img/articles/2023/03/17/L_114140_adobestock-572916885.jpg"
            },
            {
                "primaryText": "Descuentos del 10%",
                "secondaryText": "para estudiantes",
                "imageSource": "https://buenavibra.es/wp-content/uploads/2017/04/bigstock-summer-vacation-holidays-tra-139944923_opt.jpg"
            },
            {
                "primaryText": "3 boletos al precio de 2",
                "secondaryText": "Para primera clase en cualquier vuelo",
                "imageSource": "https://cdn.bolivia.com/sdi/2022/06/07/consejos-viajar-vacaciones-1036520.jpg"
            }
        ],
        "logoUrl": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png"
    }
};

const DOCUMENT_ID3 = "Chiapas";

const datasource3 = {
    "listData": {
        "headerTitle": "Viajes Blue | Vuelos con destino a Chiapas",
        "headerSubtitle": "Header subtitle",
        "headerAttributionImage": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png",
        "backgroundImageSource": "https://res.cloudinary.com/worldpackers/image/upload/c_fill,f_auto,q_auto,w_1024/v1/guides/article_cover/qjrpk8y82hjmprbjmdgv",
        "hintText": "Prueba diciendo, \"quiero 3 boletos para Chiapas\"",
        "listItemsToShow": [
            {
                "primaryText": "Primera clase",
                "secondaryText": "MXN$2,594",
                "imageSource": "https://cnnespanol.cnn.com/wp-content/uploads/2021/11/211101092025-vo-aviones-okok-full-169.jpg?quality=100&strip=info"
            },
            {
                "primaryText": "Premium economy",
                "secondaryText": "MXN$2000",
                "imageSource": "https://media.traveler.es/photos/6137679b8f298b3a7a5bc775/master/w_1600%2Cc_limit/159817.jpg"
            },
            {
                "primaryText": "Clase turista",
                "secondaryText": "MXN$1200",
                "imageSource": "https://media.traveler.es/photos/6137615ecb06ad0f20e11a3f/master/w_1600%2Cc_limit/203503.jpg"
            }
        ]
    }
};

const DOCUMENT_ID4 = "Acapulco";

const datasource4 = {
    "listData": {
        "headerTitle": "Viajes Blue | Vuelos con destino a Acapulco",
        "headerSubtitle": "Header subtitle",
        "headerAttributionImage": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png",
        "backgroundImageSource": "https://www.eleconomista.com.mx/__export/1653496874113/sites/eleconomista/img/2022/05/25/turismo_portada.jpg_1014274486.jpg",
        "hintText": "Prueba diciendo, \"quiero 3 boletos para Acapulco\"",
        "listItemsToShow": [
            {
                "primaryText": "Primera clase",
                "secondaryText": "MXN$3,400",
                "imageSource": "https://cnnespanol.cnn.com/wp-content/uploads/2021/11/211101092025-vo-aviones-okok-full-169.jpg?quality=100&strip=info"
            },
            {
                "primaryText": "Premium economy",
                "secondaryText": "MXN$2,800",
                "imageSource": "https://media.traveler.es/photos/6137679b8f298b3a7a5bc775/master/w_1600%2Cc_limit/159817.jpg"
            },
            {
                "primaryText": "Clase turista",
                "secondaryText": "MXN$2,000",
                "imageSource": "https://media.traveler.es/photos/6137615ecb06ad0f20e11a3f/master/w_1600%2Cc_limit/203503.jpg"
            }
        ]
    }
};

const DOCUMENT_ID5 = "Cancun";

const datasource5 = {
    "listData": {
        "headerTitle": "Viajes Blue | Vuelos con destino a Cancún",
        "headerSubtitle": "Header subtitle",
        "headerAttributionImage": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png",
        "backgroundImageSource": "https://oasishoteles.com/blog/wp-content/uploads/2021/11/hoteles-viaje-cancun.jpg",
        "hintText": "Prueba diciendo, \"quiero 3 boletos para Cancún\"",
        "listItemsToShow": [
            {
                "primaryText": "Primera clase",
                "secondaryText": "MXN$3,600",
                "imageSource": "https://cnnespanol.cnn.com/wp-content/uploads/2021/11/211101092025-vo-aviones-okok-full-169.jpg?quality=100&strip=info"
            },
            {
                "primaryText": "Premium economy",
                "secondaryText": "MXN$3,000",
                "imageSource": "https://media.traveler.es/photos/6137679b8f298b3a7a5bc775/master/w_1600%2Cc_limit/159817.jpg"
            },
            {
                "primaryText": "Clase turista",
                "secondaryText": "MXN$2,700",
                "imageSource": "https://media.traveler.es/photos/6137615ecb06ad0f20e11a3f/master/w_1600%2Cc_limit/203503.jpg"
            }
        ]
    }
};

const DOCUMENT_ID6 = "ayudaa";

const datasource6 = {
    "headlineData": {
        "headerTitle": "Viajes blue",
        "secondaryText": "puedes visualizar los vuelos disponibles",
        "footerHintText": "Intenta decir, \"muestra viajes a cancún\"",
        "headerAttributionImage": "https://primary.jwwb.nl/public/v/r/p/temp-imwnpzlmqnbzpdowrnof/6ea0qg/logoflydaily.png"
    }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};





const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OfertaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OfertaCustomIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Disfruta de las ofertas';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID2, datasource2);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const viajeHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ViajeIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const {intent} = handlerInput.requestEnvelope.request;

        const destino = intent.slots.destino.value;
        
        
        if(destino==='chiapas'){
            const speakOutput = 'Estos son los vuelos disponibles con destino a Chiapas';
            

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID3, datasource3);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
            
        }else if(destino==='acapulco'){
            const speakOutput = 'Estos son los vuelos disponibles con destino a Acapulco';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID4, datasource4);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
            
        }else if(destino==='cancún'){
            const speakOutput = 'Estos son los vuelos disponibles con destino a cancúnn';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID5, datasource5);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();    
        }
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¿En que puedo ayudarte?';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID6, datasource6);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adiós!';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID2);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no entendi lo que dijiste';
          if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource1);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OfertaIntentHandler,
        viajeHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
        .addRequestInterceptors(
            LocalizationInterceptor,
            LoggingRequestInterceptor,
            LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
            LoggingResponseInterceptor,
            SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();