DELETE trailerflix.contenido_actores.* FROM trailerflix.contenido_actores WHERE Contenido_id > 0;
DELETE trailerflix.contenido_busquedas.* FROM trailerflix.contenido_busquedas WHERE Contenido_id > 0;
DELETE trailerflix.contenido_generos.* FROM trailerflix.contenido_generos WHERE Contenido_id > 0;
DELETE trailerflix.contenido.* FROM trailerflix.contenido WHERE id > 0;
DELETE trailerflix.actores.* FROM trailerflix.actores WHERE id > 0;
DELETE trailerflix.busquedas.* FROM trailerflix.busquedas WHERE id < 500;
DELETE trailerflix.busquedas.* FROM trailerflix.busquedas WHERE id >=500 AND id < 1000;
DELETE trailerflix.busquedas.* FROM trailerflix.busquedas WHERE id >= 1000 AND id < 1500;
DELETE trailerflix.generos.* FROM trailerflix.generos WHERE id > 0;