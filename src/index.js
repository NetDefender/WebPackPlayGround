import Highlighter from 'web-highlighter';

document.addEventListener('DOMContentLoaded', () => {
    const controller = new Controller();
});

//Clase que controla el comportamiento de la página en cliente. Se tiene que llamar cuando el DOM está cargado
class Controller {

    constructor() {
        this.storage = new Storage('document/highlight');
        this.highlighter = new Highlighter({
            $root: document.getElementById('text-content'),
            style: {
                className: 'custom-highlight',
            },
        });

        //Deserialize
        const existingValue = this.storage.deserialize();
        if(existingValue && Array.isArray(existingValue)) {
            existingValue.forEach(item => this.highlighter.fromStore(item.startMeta, item.endMeta, item.text, item.id, item.extra))
        }

        this.highlighter
            .on(Highlighter.event.CLICK, ({id}) => {
                //Ejemplo, se borra. lo que produce a su vez el evento de borrado.
                this.highlighter.remove(id);
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
}

//Clase local para serializar y deserializar. Habrá que almacenar en remoto con fetch o xhr
class Storage {
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
}