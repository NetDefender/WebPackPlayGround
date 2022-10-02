import Highlighter from 'web-highlighter';

document.addEventListener('DOMContentLoaded', () => {
    const controller = new Controller();
});

//Clase que controla el comportamiento de la página en cliente. Se tiene que llamar cuando el DOM está cargado
class Controller {
    #elementHighlighted;
    #classElementHighlighted;

    constructor() {
        this.storage = new HighlightStorage('document/highlight');
        this.root = document.getElementById('text-content');
        this.highlighter = new Highlighter({
            $root: this.root,
            style: {
                className: 'custom-highlight',
            },
        });
        this.#configureHighlighter();
        this.removeHighlight = document.getElementById('bto-remove-highlight');
        this.removeHighlight.addEventListener('click', () => this.#removeHighlightedItem());
        this.commentContent = document.getElementById('comment-content');
        this.commentContent = document.getElementById('comment-content');
        this.updateComment = document.getElementById('bto-update-comment');
        this.updateComment.addEventListener('click', () => this.#updateComment());
        this.idContent = document.getElementById('id-content');
        this.jsonContent = document.getElementById('json-content');
    }

    #configureHighlighter() {
        this.#classElementHighlighted = 'click-highlight';
        //Deserialize
        const existingValue = this.storage.deserialize();
        if(existingValue && Array.isArray(existingValue)) {
            existingValue.forEach(item => this.highlighter.fromStore(item.startMeta, item.endMeta, item.text, item.id, item.extra))
        }

        this.highlighter
            .on(Highlighter.event.CLICK, ({id}) => {
                //Ejemplo, se borra. lo que produce a su vez el evento de borrado.
                //this.highlighter.remove(id);
                
                this.#showHighlightedItem(id);
            })
            .on(Highlighter.event.HOVER, ({id}) => {
                this.highlighter.addClass('hover-highlight', id);
            })
            .on(Highlighter.event.HOVER_OUT, ({id}) => {
                this.highlighter.removeClass('hover-highlight', id);
            })
            .on(Highlighter.event.CREATE, ({sources}) => {
                this.storage.serialize(sources);
            })
            .on(Highlighter.event.REMOVE, ({ids}) => {
                var items = this.storage.deserialize();
                ids.forEach(id => {
                    items = items.filter(item => item.id != id)
                });
                this.storage.clear();
                this.storage.serialize(items);
            });

        //Start
        this.highlighter.run();
        console.log("DOMContentLoaded");
    }

    #showHighlightedItem(id) {
        this.#elementHighlighted = this.storage.getById(id);
        if(!this.#elementHighlighted) {
            console.warn('No hay un elemento resaltado. Pulse en uno');
            return;
        }
        //console.log(JSON.stringify(this.#elementHighlighted));
        this.idContent.value = this.#elementHighlighted.id;
        this.commentContent.value = this.#elementHighlighted.comment || null;

        const allItems = this.storage.deserialize();
        allItems.forEach(item => this.highlighter.removeClass(this.#classElementHighlighted, item.id));
        this.highlighter.addClass(this.#classElementHighlighted, this.#elementHighlighted.id);
        this.jsonContent.textContent = JSON.stringify(this.#elementHighlighted, null, 2);
    }

    #removeHighlightedItem() {
        if(!this.#elementHighlighted) {
            console.warn('No hay un elemento resaltado. Pulse en uno');
        }
        this.highlighter.remove(this.#elementHighlighted.id);
        this.#clearHighlightedItem();
    }

    #clearHighlightedItem() {
        if(!this.#elementHighlighted) {
            console.warn('No hay un elemento resaltado. Pulse en uno');
        }

        this.idContent.value = null;
        this.commentContent.value = null;
        this.#elementHighlighted = null;
    }

    #updateComment() {
        if(!this.#elementHighlighted) {
            console.warn('No hay un elemento resaltado. Pulse en uno');
        }
        this.#elementHighlighted.comment = this.commentContent.value;
        this.storage.updateById(this.#elementHighlighted.id, this.#elementHighlighted);
    }
}

//Clase local para serializar y deserializar. Habrá que almacenar en remoto con fetch o xhr
class HighlightStorage {
    constructor(context) {
        this._context = context;
    }

    get context() {
        return this._context;
    }

    serialize(data) {
        if(!Array.isArray(data)) {
            data = [data];
        }
        const existingValue = this.deserialize();
        data.forEach(item => existingValue.push(item));
        localStorage.setItem(this.context, JSON.stringify(existingValue));
    }

    deserialize() {
        var item = localStorage.getItem(this.context);
        return JSON.parse(item) || [];
    }

    clear() {
        localStorage.removeItem(this.context);
    }

    getById(id) {
        const existingValue = this.deserialize();
        return existingValue.find(item => item.id == id);
    }

    updateById(id, newValue) {
        const items = this.deserialize();
        const indexToUpdate = items.findIndex(item => item.id == id);
        if(indexToUpdate < 0) {
            console.error(`No se encontró el elmento ${id} en el almacén`);
            return;
        }
        items[indexToUpdate] = newValue;
        this.clear();
        this.serialize(items);
    }
}