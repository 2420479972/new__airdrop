export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        'postcss-px-to-viewport-8-plugin': {
            viewportWidth: 1100,
            unitPrecision: 6,
            unitToConvert: 'px',
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            propList: ['*'],
        }
    },
}

