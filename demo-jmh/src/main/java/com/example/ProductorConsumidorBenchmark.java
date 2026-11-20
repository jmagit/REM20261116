package com.example;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Control;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.Throughput) // Mide operaciones por segundo
@OutputTimeUnit(TimeUnit.MICROSECONDS)
@Warmup(iterations = 3, time = 1)
@Measurement(iterations = 5, time = 1, timeUnit = TimeUnit.SECONDS)
@Fork(2)
@Threads(9) // 2 productores y 1 consumidor
public class ProductorConsumidorBenchmark {

    @State(Scope.Group) // Compartido entre productores y consumidores del mismo grupo
    public static class EstadoCola {
    	// La interfaz BlockingQueue representa una cola segura para subprocesos. Bloquea un subproceso que intente 
    	// insertar elementos en la cola que está llena y bloquea al subproceso que intente extraer elementos de la cola 
    	// si está vacía. ArrayBlockingqueue es una cola con capacidad limitada.
//    	public BlockingQueue<Integer> cola = new ArrayBlockingQueue<>(100); // repaldada por un array
    	public BlockingQueue<Integer> cola = new LinkedBlockingQueue<>(100); // respaldada por nodos
    }

	@Benchmark
	public void baseline() {
	}

    @Benchmark
    @Group("flujoCola")
    @GroupThreads(2) // 2 hilos llamarán a este método continuamente
    public void producir(EstadoCola estado, Control control) throws InterruptedException {
        // offer con timeout evita que el hilo quede bloqueado al terminar la iteración
        while (!control.stopMeasurement && !estado.cola.offer(1, 10, TimeUnit.MILLISECONDS)) {
            // Reintenta mientras no termine la medición
        }
    }

    @Benchmark
    @Group("flujoCola")
    @GroupThreads(1) // 1 hilo llamará a este método continuamente
    public Integer consumir(EstadoCola estado, Control control) throws InterruptedException {
        Integer valor = null;
        while (!control.stopMeasurement && (valor = estado.cola.poll(10, TimeUnit.MILLISECONDS)) == null) {
            // Reintenta mientras no termine la medición
        }
        return valor;
    }

    public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
                .include(ProductorConsumidorBenchmark.class.getSimpleName())
                .build();
        new Runner(opt).run();
    }
}
