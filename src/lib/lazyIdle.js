import loadable from '@loadable/component'

const lazyIdle = (factory) => {
    return loadable(
        () =>
            new Promise((resolve) => {
                window.requestIdleCallback(() => resolve(factory()), {
                    timeout: 3000
                })
            })
    )
}

export default lazyIdle