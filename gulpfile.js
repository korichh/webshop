import gulp from "gulp";
import browserSync from "browser-sync";
import path from "./gulp/path.js";
import { clean, css, html, img, js, resources, toBackend, zip } from "./gulp/tasks.js";

browserSync.create();

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: `${path.buildFolder}`
        },
        notify: false,
    });

    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.resources, resources);
}

gulp.task('default', gulp.series(clean, html, css, js, img, resources, watcher));
gulp.task('backend', gulp.series(clean, toBackend, html, css, js, img, resources));
gulp.task('zip', zip);