# Neo

Neo is an innovative tool designed to enhance the way we interact with and leverage information from YouTube videos. By accepting a list of YouTube links, Neo ingests the transcripts, vectorizes them using OpenAI embeddings, and stores this data locally in a `cache` directory. This process enables a Retrieval-Augmented Generation (RAG) chat interface, allowing users to query and receive answers based on the ingested video transcripts.

## Tech Stack
- **[Llama-index](https://www.llamaindex.ai/)**: A data framework used for vectorizing and indexing YouTube transcripts.
- **[Next.js](https://nextjs.org/)**: A React framework for building user-friendly and SEO-optimized web applications, used for creating the frontend interface of Neo.
- **[Shadcn](https://ui.shadcn.com/)**: A modern UI library for designing clean and intuitive interfaces, employed to enhance the visual appeal and usability of Neo's frontend.

## Features

- **Transcript Ingestion**: Neo can process a list of YouTube video links to download and ingest transcripts.
- **Data Vectorization**: Utilizes OpenAI's advanced embedding technology to vectorize the ingested transcripts for efficient information retrieval.
- **Local Data Storage**: Instead of relying on external vector databases, Neo stores the vectorized data locally in a `cache` directory.
- **RAG-Enabled Chat Interface**: Post-ingestion, Neo's chat window is empowered with RAG capabilities, providing answers drawn directly from the processed transcripts.

## Getting Started

To set up Neo on your local machine, especially tailored for Next.js framework, follow these steps:

1. **Clone the Repository**: Start by cloning this repository to your local machine. Use the command `git clone https://github.com/j-cunanan/neo.git` in your terminal.

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies by running `npm install` or `yarn install` if you prefer yarn.

3. **Configure Environment Variables**: Rename the provided `.env_sample` file to `.env.local`. This file should include all the necessary API keys and environment-specific variables. Make sure to fill in the relevant keys:

    ```
    MODEL=gpt-3.5-turbo-0125
    NEXT_PUBLIC_MODEL=gpt-3.5-turbo-0125
    OPENAI_API_KEY=sk-...
    ```

    Replace the keys with your actual API keys. Add any other relevant keys in a similar fashion.

4. **Run the Development Server**: Launch the Next.js development server by running `npm run dev` or `yarn dev`. Your Neo application should now be accessible at `http://localhost:3000`.

Follow these steps to get your Neo project up and running, ready to ingest YouTube transcripts and enable RAG-powered chat interactions.


## Usage

1. **Start Neo**: Launch the Neo application.
2. **Ingest Transcripts**: Paste your list of YouTube links into the designated area and press `Ingest Transcripts`. Neo will download the transcripts, vectorize them, and store the data locally.
3. **Interact with the Chat**: Once the data ingestion process is complete, you can start interacting with the RAG-enabled chat window. Simply type in your queries, and Neo will provide answers based on the ingested video transcripts.

## TODO

- [ ] **User Interface Improvements**: Enhance the user interface for a more intuitive experience during the ingestion process and interactions.
- [ ] **Add notifications or loading screen for events**: Ingesting, vectorizing, and storing data can take time. Add notifications or a loading screen to inform users of the progress.
- [ ] **Support for Multiple Languages**: Expand the tool's capabilities to ingest and process transcripts in multiple languages.
- [ ] **Integration with Vector Databases**: Add support for storing vectorized data in external vector databases for scalability.
- [ ] **Real-Time Transcript Updates**: Implement functionality to automatically update transcripts and their vectorized forms when new content is available.
- [ ] **Advanced Query Handling**: Improve the RAG model's ability to understand and respond to complex queries more effectively.

## Contributing

Contributions to Neo are welcome! Please refer to the contributing guidelines for more information on how you can contribute to the project.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.
