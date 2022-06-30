const API = "https://graph.facebook.com/"
const campos = "?fields=id,name,email,picture&access_token=EAAEWkC2G1h8BAHOWRv7yI7kyuIeQZBtbPyIv4a56sbmWpYEBCeyPM7w5VZCAG1VHaHHWlmNmwB0CJi8mMJQsTz1mefUuSptbgpRimIIKZCGJbNZBBOZBBYzMdRBXZAhBn3gQuP0uVxvZC8FubG55jhsCE1dWtU6YeOGe9ntVToUb2Ak63dcTVrM";

const app = Vue.createApp({
    data() {
        return {
            busqueda: null,
            result: null,
            error: null,
            favoritos: new Map() //se crea un map para guardar a los favoritos
        }
    },
    created() {
        const favoritosGuardados = JSON.parse(window.localStorage.getItem("fav"))
        //Está evaluando si existe y ademas midiendo su longitud
        //se aebrevia con ?
        if (favoritosGuardados?.length) {
            //recreamos el map con un nuevo nombre
            const favoritosnew = new Map(
                //ME valgo del metodo map para obtener el id como key y el arreglo como value
                favoritosGuardados.map(alias => [alias.id, alias]))
            //asignamos a la variable favoritos de la instancia el valor del nuevo FavoritosGuardados  
            this.favoritos = favoritosnew

        }
        //console.log(FavoritosGuardados)
    },
    computed: {
        //queremos saber si está en favoritos
        estaFavoritos() {
            return this.favoritos.has(this.result.id)
        },
        todosFavoritos() {
            //pasamos la información a un autentico array
            return Array.from(this.favoritos.values())
            //el método values() traerá solo los valores sin la clave
        }
    },
    methods: {
        async Buscar() {
            this.result = this.error = null;
            try {
                const response = await fetch(API + this.busqueda + campos)
                if (!response.ok) throw new Error("Perfil no encontrado mi loko")
                const data = await response.json()
                console.log(data)
                this.result = data
            } catch (e) {
                this.error = e
            }
            finally {
                this.busqueda = null
            }
        }, // aquí se cierra el metodo buscar
        addFavorito() {
          this.favoritos.set(this.result.id, this.result)
          this.actualizarStorage()
        },
        removeFavorito() {
          this.favoritos.delete(this.result.id)
          this.actualizarStorage()
        },
        actualizarStorage() {
          window.localStorage.setItem('fav', JSON.stringify(this.todosFavoritos))
        },
        mostrarFavorito(parametro){
          //tipo array con objetos de javascript o tipo json
          this.result = parametro
        }
    }
})