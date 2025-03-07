/* eslint-disable camelcase */
exports.up = (pgm) => {
  // Membuat tabel 'threads'
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)", // ID unik untuk setiap thread
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(255)", // Judul thread
      notNull: true, // Judul wajib ada
    },
    body: {
      type: "TEXT", // Isi thread
      notNull: true, // Isi thread wajib ada
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    owner: {
      type: "VARCHAR(50)", // ID user yang membuat thread
      notNull: true, // Harus ada, terkait dengan user yang membuat thread
      references: "users(id)", // Menghubungkan owner ke id di tabel 'users'
      onDelete: "CASCADE", // Jika user dihapus, maka thread terkait juga akan dihapus
    },
  });
};

exports.down = (pgm) => {
  // Menghapus tabel 'threads' jika migrasi dibatalkan
  pgm.dropTable("threads");
};
