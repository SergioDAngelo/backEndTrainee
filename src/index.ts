import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
app.use(express.json())
app.listen(PORT, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

// GET /artists - Traer todos los artistas disponibles.
app.get('/artists', async (req: Request, res: Response) => {
  try {
    const artists = await prisma.artists.findMany();
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los artistas.' });
  }
});

// GET /artists/:artist_id - Traer un artista por su id e incluir todas sus publicaciones ordenadas por fecha de publicacion.
app.get('/artists/:artist_id', async (req: Request, res: Response) => {
  const { artist_id } = req.params;

  try {
    const artist = await prisma.artists.findUnique({
      where: { id: parseInt(artist_id) },
      include: { post: {
        orderBy: { post_date: 'asc' },
        include: { songs: true } }}, 
    });

    if (!artist) {
      return res.status(404).json({ error: 'Artista no encontrado.' });
    }

    res.json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el artista.' });
  }
});


// POST /new_artist - Crear un nuevo artista.
app.post('/new_artist', async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Falta el nombre del artista.' });
  }

  try {
    const new_artist = await prisma.artists.create({
      data: { name },
    });

    res.json(new_artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al crear el artista.' });
  }
});

// PUT /artists/:artist_id - Actualizar los datos de un artista.
app.put('/upd_artist/:artist_id', async (req: Request, res: Response) => {
  const { artist_id } = req.params;
  const { name } = req.body;

  try {
    const upd_artist = await prisma.artists.update({
      where: { id: parseInt(artist_id) },
      data: { name },
    });

    res.json(upd_artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el artista.' });
  }
});

// DELETE /artists/:artist_id - Borrar un artista por su id.
app.delete('/del_artist/:artist_id', async (req: Request, res: Response) => {
  const { artist_id } = req.params;

  try {
    const deleted_artist = await prisma.artists.delete({
      where: { id: parseInt(artist_id) },
    });

    if (!deleted_artist) {
      return res.status(404).json({ error: 'Artista no encontrado.' });
    }

    res.sendStatus(204).json({ message: 'El artista ha sido borrado con exito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al borrar el artista.' });
  }
});

// GET /publicacion/:publicacion_id - Traer una publicación por su id e incluir la cantidad de temas, duración total del disco en segundos y todos los temas.
app.get('/post/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(post_id) },
      include: {
        songs: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada.' });
    }

    const amount_songs = post.songs.length;
    const length_song = post.songs.reduce((total, tema) => total + tema.duration, 0);

    res.json({
      post,
      amount_songs,
      length_song,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener la publicación.' });
  }
});

// POST /publicacion - Crear una publicación y sus temas.
app.post('/new_post', async (req: Request, res: Response) => {
  const { artist_id, type, name, post_date, songs } = req.body;

  if (!artist_id || !type || !name || !post_date || !songs) {
    return res.status(400).json({ error: 'Faltan datos para crear la publicacion.' });
  }

  try {
    const post = await prisma.post.create({
      data: {
        artist_id,
        type,
        name,
        post_date,
        songs: {
          create: songs.map((song: any) => ({
            index: song.index,
            name: song.name,
            duration: song.duration,
          })),
        },
      },
      include: {
        songs: true,
      },
    });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al crear la publicación.' });
  }
});

// DELETE /del_post/:post_id 
app.delete('/del_post/:post_id', async (req, res) => {
  const { post_id } = req.params;

  try {
    // Eliminar los registros de Song relacionados con la publicación
    await prisma.song.deleteMany({
      where: {
        post_id: parseInt(post_id),
      },
    });
    // Eliminar la publicación
    await prisma.post.delete({
      where: { id: parseInt(post_id) },
    });

    res.status(204).json({ message: 'El artista ha sido borrado con exito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al borrar el post.' });
  }
});

// GET /song/:song_id - Traer una cancion por su id y Luego, se incluyen los posts relacionados con ese tema.
app.get('/song/:song_id', async (req, res) => {
  const { song_id } = req.params;

  try {
    const song = await prisma.song.findUnique({
      where: {
        id: parseInt(song_id),
      },
      include: {
        post: true,
      },
    });

    if (!song) {
      return res.status(404).json({ error: 'No se encontró el tema.' });
    }

    res.json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el tema.' });
  }
});
