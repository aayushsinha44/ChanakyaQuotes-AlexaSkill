var intentHandlers = {};
var APP_ID = 'amzn1.ask.skill.3a903608-21db-445a-ae53-b1f5c7201df1';

var quotes = [
    "All the creatures are pleased by loving words; and therefore we should address words that are pleasing to all, for there is no lack of sweet words.",
    "No messenger can travel about in the sky and no tidings come from there. The voice of its inhabitants as never heard, nor can any contact be established with them.",
    "He who desires sense gratification must give up all thoughts of acquiring knowledge; and he who seeks knowledge must not hope for sense gratification.",
    "He who is not shy in the acquisition of wealth, grain and knowledge, and in taking his meals, will be happy",
    "Even a pandit comes to grief by giving instruction to a foolish disciple, by maintaining a wicked wife, and by excessive familiarity with the miserable.",
    "Education is the best friend. An educated person is respected everywhere. Education beats the beauty and the youth.",
    "O wise man! Give your wealth only to the worthy and never to others. The water of the sea received by the clouds is always sweet.",
    "Foolishness is indeed painful, and verily so is youth, but more painful by far than either is being obliged in another person's house.",
    "Fate makes a beggar a king and a king a beggar. He makes a rich man poor and a poor man rich.",
    "The hearts of base men burn before the fire of other's fame, and they slander them being themselves unable to rise to such a high position.",
    "Those born blind cannot see; similarly blind are those in the grip of lust. Proud men have no perception of evil; and those bent on acquiring riches see no sin in their actions.",
    "The learned are envied by the foolish; rich men by the poor; chaste women by adulteresses; and beautiful ladies by ugly ones.",
    "There is no disease (so destructive) as lust; no enemy like infatuation; no fire like wrath; and no happiness like spiritual knowledge.",
    "Generosity, pleasing address, courage and propriety of conduct are not acquired, but are inbred qualities.",
    "For one whose heart melts with compassion for all creatures; what is the necessity of knowledge, liberation, matted hair on the head, and smearing the body with ashes.",
    "Whores don't live in company of poor men, citizens never support a weak company and birds don't build nests on a tree that doesn't bear fruits.",
    "Charity puts and end to poverty; righteous conduct to misery; discretion to ignorance; and scrutiny to fear.",
    "A woman does not become holy by offering by charity, by observing hundreds of fasts, or by sipping sacred water, as by sipping the water used to wash her husbands feet.",
    "For the moon, though one, dispels the darkness, which the stars, though numerous, can not.",
    "He who is engrossed in family life will never acquire knowledge; there can be no mercy in the eater of flesh; the greedy man will not be truthful; and purity will not be found in a woman a hunter.",
    "Let not a single day pass without your learning a verse, half a verse, or a fourth of it, or even one letter of it; nor without attending to charity, study and other pious activity.",
    "It is better to live under a tree in a jungle inhabited by tigers and elephants, to maintain oneself in such a place with ripe fruits and spring water, to lie down on grass and to wear the ragged barks of trees than to live amongst one's relations when reduced to poverty.",
    "Consider again and again the following: the right time, the right friends, the right place, the right means of income, the right ways of spending, and from whom you derive your power.",
    "One whose knowledge is confined to books and whose wealth is in the possession of others, can use neither his knowledge nor wealth when the need for them arises.",
    "Therefore kings gather round themselves men of good families, for they never forsake them either at the beginning, the middle or the end.",
    "Moral excellence is an ornament for personal beauty; righteous conduct, for high birth; success for learning; and proper spending for wealth.",
    "Knowledge is lost without putting it into practice; a man is lost due to ignorance; an army is lost without a commander; and a woman is lost without a husband.",
    "Contentment with little or nothing to eat although one may have a great appetite; to awaken instantly although one may be in a deep slumber; unflinching devotion to the master; and bravery; these six qualities should be learned from the dog.",
    "The rain water enlivens all living beings of the earth both movable (insects, animals, humans, etc.) and immovable (plants, trees, etc.), and then returns to the ocean it value multiplied a million fold.",
    "Constant travel brings old age upon a man; a horse becomes old by being constantly tied up; lack of sexual contact with her husband brings old age upon a woman; and garments become old through being left in the sun.",
    "A person should not be too honest. Straight trees are cut first and honest people are screwed first.",
    "Test a servant while in the discharge of his duty, a relative in difficulty, a friend in adversity, and a wife in misfortune.",
    "To have ability for eating when dishes are ready at hand, to be robust and virile in the company of one's religiously wedded wife, and to have a mind for making charity when one is prosperous are the fruits of no ordinary austerities.",
    "He who is overly attached to his family members experiences fear and sorrow, for the root of all grief is attachment. Thus one should discard attachment to be happy.",
    "The world's biggest power is the youth and beauty of a woman."
];

exports.handler = function (event, context) {
    try {

        if (APP_ID !== '' && event.session.application.applicationId !== APP_ID) {
            context.fail('Invalid Application ID');
        }

        if(!event.session.attributes) {
            event.session.attributes = {};
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, new Response(context, event.session));
        } else if (event.request.type === 'IntentRequest') {
            var response = new Response(context, event.session);
            if (event.request.intent.name in intentHandlers) {
                intentHandlers[event.request.intent.name](event.request, 
                    event.session, 
                    response, 
                    getSlots(event.request));
            } else {
                response.speechText = 'Unknown intent';
                response.shouldEndSession = true;
                response.done();
            }
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch(e) {
        context.fail('Exception: ' + getError(e));
    }
};

function getSlots(request) {
    var slots = {};
    for(var key in request.intent.slots) {
        if(request.intent.slots[key].value !== undefined) {
            slots[key] = request.intent.slots[key].value;
        }
    }
    return slots;
}


// Creates response for alexa request
var Response = function (context, session) {
    this.speechText = '';
    this.shouldEndSession = true;
    this.ssmlEn = true;
    this._context = context;
    this._session = session;

    this.done = function(options) {

        if(options && options.speechText) {
            this.speechText = options.speechText;
        }

        if(options && options.repromptText) {
            this.repromptText = options.repromptText;
        }

        if(options && options.ssmlEn) {
            this.ssmlEn = options.ssmlEn;
        }

        if(options && options.shouldEndSession) {
            this.shouldEndSession = options.shouldEndSession;
        }

        this._context.succeed(buildAlexaResponse(this));
    }

    this.fail = function(msg) {
        this._context.fail(msg);
    }
}

function createSpeechObject(text, ssmlEn) {
    if(ssmlEn) {
        return {
            type: 'SSML',
            ssml: '<speak>' + text + '</speak>'
        }
    } else {
        return {
            type: 'PlainText', 
            text: text
        }
    }
}

function buildAlexaResponse(response) {
    var alexaResponse = {
        version: '1.0',
        response: {
            outputSpeech: createSpeechObject(response.speechText, response.ssmlEn),
            shouldEndSession: response.shouldEndSession
        }
    };

    if(response.repromptText) {
        alexaResponse.response.repromptText = {
            outputSpeech: createSpeechObject(response.repromptText, response.ssmlEn)
        };
    }

    if(response.cardTitle) {
        alexaResponse.response.card = {
            type: 'Simple',
            title: response.cardTitle
        };

        if(response.imageUrl) {
            alexaResponse.response.card.type = 'Standard';
            alexaResponse.response.card.text = response.cardContent;
            alexaResponse.response.card.image = {
                smallImageUrl: response.imageUrl,
                largeImageUrl: response.imageUrl
            };
        } else {
            alexaResponse.response.card.content = response.cardContent;
        }
    }

    if(!response.shouldEndSession && response._session && response._session.attributes) {
        alexaResponse.sessionAttributes = response._session.attributes;
    }

    return alexaResponse;
}

function getError(error) {
    var msg = '';
    if (typeof error === 'object') {
        if(error.message) {
            msg = ': Message : ' + error.message;
        }

        if (error.stack) {
            msg += '\nStacktrace:';
            msg += '\n====================\n';
            msg += error.stack;
        } 
    } else {
        msg = error;
        msg += ' - This error is not an object';
    }

    return msg;
}


function onSessionStarted(sessionStartedRequest, session) {

}

function onSessionEnded(sessionEndedRequest, session) {

}

function onLaunch(lauchRequest, session, response) {
    response.speechText = 'Hi, welcome to famous chanakya quotes app';
    response.repromptText = 'For example, you can say tell me a quote';
    response.shouldEndSession = false;
    response.done();
}


intentHandlers['GetNewFactIntent'] = function(request, session, response, slots) {
    var fact = quotes[Math.floor(Math.random() * quotes.length)];
    response.speechText = fact;
    response.shouldEndSession = true;
    response.done();
}

intentHandlers['AMAZON.HelpIntent'] = function(request, session, response, slots) {
    var fact = "you can say, tell me a quote";
    response.speechText = fact;
    response.shouldEndSession = false;
    response.done();
}

intentHandlers['AMAZON.StopIntent'] = function(request, session, response, slots) {
    var fact = "Thank you for using famous chanakya skill";
    response.speechText = fact;
    response.shouldEndSession = true;
    response.done();
}

intentHandlers['AMAZON.CancelIntent'] = function(request, session, response, slots) {
    var fact = "Thank you for using famous chanakya skill";
    response.speechText = fact;
    response.shouldEndSession = true;
    response.done();
}
