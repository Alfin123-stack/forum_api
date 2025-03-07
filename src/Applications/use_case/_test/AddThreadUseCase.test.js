const AddThreadUseCase = require("../AddThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const Thread = require("../../../Domains/threads/entities/Thread");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");

describe("AddThreadUseCase", () => {
  // Test untuk menambah thread dengan benar
  it("should orchestrate the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "A thread",
      body: "A long thread",
    };

    const mockAddedThread = new Thread({
      id: "thread-123",
      title: "A thread",
      owner: "user-123",
    });

    // Membuat dependency untuk use case
    const mockThreadRepository = new ThreadRepository();

    // Mocking method yang dibutuhkan
    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(mockAddedThread)
    );

    // Membuat instance use case
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      "user-123",
      useCasePayload
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new Thread({
        id: "thread-123",
        title: "A thread",
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      "user-123",
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });

  // Test untuk ketika judul thread sudah ada
  it("should throw error when title is already taken", async () => {
    const useCasePayload = {
      title: "A thread",
      body: "A long thread",
    };

    const mockThreadRepository = new ThreadRepository();

    // Mocking method
    mockThreadRepository.addThread = jest.fn(() =>
      Promise.reject(new Error("TITLE_ALREADY_EXISTS"))
    );

    // Membuat instance use case
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      addThreadUseCase.execute("user-123", useCasePayload)
    ).rejects.toThrow("TITLE_ALREADY_EXISTS");
  });

  // Test untuk ketika properti title atau body hilang
  it("should throw error when title or body is missing", async () => {
    const useCasePayload = {
      title: "A thread", // Missing body
    };

    const mockThreadRepository = new ThreadRepository();
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert: Check that the error is thrown for missing properties
    await expect(
      addThreadUseCase.execute("user-123", useCasePayload)
    ).rejects.toThrow(
      "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
    );
  });

  // Test untuk ketika title atau body bukan string
  it("should throw error when title or body has invalid type", async () => {
    const useCasePayload = {
      title: 12345, // Invalid type for title
      body: "A long thread",
    };

    const mockThreadRepository = new ThreadRepository();
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert: Check that the error is thrown for invalid property type
    await expect(
      addThreadUseCase.execute("user-123", useCasePayload)
    ).rejects.toThrow(
      "tidak dapat membuat thread baru karena tipe data tidak sesuai"
    );
  });
});
