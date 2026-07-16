package com.pbtp1.service;

import com.pbtp1.model.Categoria;
import com.pbtp1.model.Produto;
import com.pbtp1.repository.CategoriaRepository;
import com.pbtp1.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));
    }

    @Transactional
    public Produto salvar(Produto produto) {
        if (produto.getCategoria() != null && produto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(produto.getCategoria().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + produto.getCategoria().getId()));
            produto.setCategoria(categoria);
        }
        return produtoRepository.save(produto);
    }

    @Transactional
    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);

        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setPreco(produtoAtualizado.getPreco());

        if (produtoAtualizado.getCategoria() != null && produtoAtualizado.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(produtoAtualizado.getCategoria().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + produtoAtualizado.getCategoria().getId()));
            produto.setCategoria(categoria);
        } else {
            produto.setCategoria(null);
        }

        return produtoRepository.save(produto);
    }

    @Transactional
    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new EntityNotFoundException("Produto não encontrado: " + id);
        }
        produtoRepository.deleteById(id);
    }

    public List<Produto> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Produto> buscarPorFaixaPreco(Double min, Double max) {
        return produtoRepository.findByPrecoBetween(min, max);
    }

    public List<Produto> buscarPorCategoria(Long categoriaId) {
        return produtoRepository.findByCategoriaId(categoriaId);
    }

    public List<Produto> buscarPorTermo(String termo) {
        return produtoRepository.buscarPorTermo(termo);
    }
}