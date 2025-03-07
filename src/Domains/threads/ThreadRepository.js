class ThreadRepository {
  // Menambahkan thread baru
  async addThread(thread) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Memverifikasi apakah title thread sudah ada
  async verifyAvailableThread(id) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  // Mendapatkan thread berdasarkan title
  async getThreadById(id) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
