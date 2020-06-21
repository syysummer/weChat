import Vue from 'vue'
import Toast from './toast.vue'

const ToastController = Vue.extend(Toast)
const instance = new ToastController().$mount(document.createElement('div'))

const toast = (option) => {
    document.body.appendChild(instance.$el)
    instance.show(option)
}

toast.loading = (msg) => {
    document.body.appendChild(instance.$el);
    instance.loading(msg);
}

toast.show = (msg) => {
    document.body.appendChild(instance.$el);
    instance.show(msg);
}

toast.success = (msg) => {
    document.body.appendChild(instance.$el);
    instance.success(msg);
}

toast.error = (msg) => {
    document.body.appendChild(instance.$el);
    instance.error(msg);
}

toast.warning = (msg) => {
    document.body.appendChild(instance.$el);
    instance.warning(msg);
}

toast.close = instance.close

export default {
    install(Vue) {
        Vue.toast = Vue.prototype.toast = toast
    }
}
