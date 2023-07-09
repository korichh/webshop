const srcFolder = './src';
const buildFolder = './docs';
const path = {
    srcFolder: srcFolder,
    buildFolder: buildFolder,
    src: {
        html: `${srcFolder}/html/*.html`,
        scss: `${srcFolder}/scss/*.scss`,
        js: `${srcFolder}/js/*.js`,
        img: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg}`,
        resources: `${srcFolder}/resources/**/*`,
    },
    build: {
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        js: `${buildFolder}/js/`,
        img: `${buildFolder}/img/`,
        resources: `${buildFolder}/`,
    },
    watch: {
        html: `${srcFolder}/html/**/*.html`,
        scss: `${srcFolder}/scss/**/*.scss`,
        js: `${srcFolder}/js/**/*.js`,
        img: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg}`,
        resources: `${srcFolder}/resources/**/*`,
    }
};

export default path;